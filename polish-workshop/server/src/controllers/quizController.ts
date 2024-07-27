import { Request, Response } from "express"
import { AppError } from "../middlewares/errors.js"
import { Answer } from "../services/player.js"
import { createNewGame } from "../models/quizModel.js";
import { Question } from "../services/game.js";


type GameProperties = {
  numberOfQuestions: number;
  questionsSetName: string;
  joinCode: string;
}

type PlayerProperties = {
  username: string;
  answers: Answer[]
}

type SummaryProperties = {
  messagePL: string;
  messageEN: string;
  players: { username: string; points: number }[]
}

type CorrectSessionGameDataResponse = {
  status: 'inGame' | 'discrepancy' | 'incorrectJoinCode';
  gameProperties: GameProperties;
  playerProperties: PlayerProperties;
}

type IncorrectSessionGameDataResponse = {
  status: 'notFound' | 'joinPossible' | 'youAreHost';
}

type SummaryGameDataResponse = {
  status: 'summary';
  summaryProperties: SummaryProperties
}

type GameDataResponse = 
  CorrectSessionGameDataResponse | 
  IncorrectSessionGameDataResponse |
  SummaryGameDataResponse

export function getGameData(req: Request, res: Response) 
{
  const { gameFromJoinCode, gameFromSessGameID } = req
  const { isHost, username } = req.session

  if (isHost) {
    const gameDataResponse: GameDataResponse = {
      status: 'youAreHost'
    }

    res.status(403).json(gameDataResponse)
    return;
  }

  if (gameFromSessGameID) {

    if (!username) {
      throw new AppError(
        'Username is not included in session',
        'usernameMissingInSession',
        500
      )
    }

    const player = gameFromSessGameID.getPlayerByUsername(username)

    if (!player) {
      throw new AppError(
        'Username is not used in this game',
        'incorrectUsername',
        500
      )
    }

    const gameProperties: GameProperties = {
      numberOfQuestions: gameFromSessGameID.numberOfQuestions,
      questionsSetName: gameFromSessGameID.questionsSetName,
      joinCode: gameFromSessGameID.joinCode
    }

    const playerProperties: PlayerProperties = {
      username: player.username,
      answers: player.answers
    }


    if (gameFromJoinCode === false) {
      const gameDataResponse: GameDataResponse = {
        status: 'incorrectJoinCode',
        gameProperties: gameProperties,
        playerProperties: playerProperties
      }

      res.status(200).json(gameDataResponse)
      return;
    }

    if (gameFromJoinCode === undefined || gameFromJoinCode === gameFromSessGameID) {
      const gameDataResponse: GameDataResponse = {
        status: 'inGame',
        gameProperties: gameProperties,
        playerProperties: playerProperties
      }

      res.status(200).json(gameDataResponse)
      return;
    }

    if (gameFromJoinCode !== gameFromSessGameID) {
      const gameDataResponse: GameDataResponse = {
        status: 'discrepancy',
        gameProperties: gameProperties,
        playerProperties: playerProperties
      }
      
      res.status(200).json(gameDataResponse)
      return;
    }

    if (gameFromJoinCode.status === 'finished') {
      const players = gameFromJoinCode.players.map((player) => {
        return { 
          username: player.username, 
          points: player.getPoints()
        }
      })

      const summaryProperties: SummaryProperties = {
        messagePL: '',
        messageEN: '',
        players: players
      }

      const gameDataResponse: GameDataResponse = {
        status: 'summary',
        summaryProperties: summaryProperties
      }
      
      res.status(200).json(gameDataResponse)
      return;
    }

  } else {

    if (gameFromJoinCode && gameFromJoinCode.isJoiningPossible()) {
      const gameDataResponse: GameDataResponse = {
        status: 'joinPossible'
      }

      res.status(200).json(gameDataResponse)
      return;
    }

    if (!gameFromJoinCode || !gameFromJoinCode.isJoiningPossible()) {
      const gameDataResponse: GameDataResponse = {
        status: 'notFound'
      }

      res.status(404).json(gameDataResponse)
      return;
    }
  }
}




type ChoiceQuestionForPlayer = {
  questionIndex: number;
  type: "multipleChoice" | "singleChoice";
  question: string;
  answers: string[];
  countdown: number;
}

type DragAndDropQuestionForPlayer = {
  questionIndex: number;
  type: "dragAndDrop";
  question: string;
  draggableNodes: string[];
  answers: (string | null)[][];
  countdown: number;
}

type QuestionForPlayer = ChoiceQuestionForPlayer | DragAndDropQuestionForPlayer

export function getGameEventsStream(req: Request, res: Response) 
{
  const { gameFromSessGameID: game } = req
  const { username } = req.session

  let id = 0;

  function getMessage(id: number, event: string, data?: any) {
    return (
      'id:' + id++ + '\n' +
      'event:' + event + '\n' +
      'data:' + (JSON.stringify(data) || '') + '\n\n'
    )
  }

  if (!game || !username) return; // just for typescript
  // error handling was dane by requestGameData middleware

  
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')

  game.onPlayerJoined((player) => {
    res.write(getMessage(id++, 'playerJoined', player))
  })

  game.onceStart((start) => {
    res.write(getMessage(id++, 'start', start))
  })

  game.onQuestion((question) => {
    let questionForPlayer: QuestionForPlayer | undefined

    switch (question.answerType) {
      case 'multipleChoice':
      case 'singleChoice':
        questionForPlayer = {
          questionIndex: game.questionIndex,
          type: question.answerType,
          question: question.question,
          answers: question.choiceAnswers?.map((question) => question.content),
          countdown: question.customCountdown || 15_000
        }
        console.log(questionForPlayer)
        break;

      case 'dragAndDrop':
        const draggableNodes: string[] = []
        const answers: (string | null)[][] = []

        question.dragAndDropAnswers.forEach((answer, answerIndex) => {
          answers[answerIndex] = []
          answer.forEach((node) => {
            if (node.isDraggable) {
              draggableNodes.push(node.content)
              answers[answerIndex].push(null) 
            } else {
              answers[answerIndex].push(node.content)
            }
          })
        })

        questionForPlayer = {
          questionIndex: game.questionIndex,
          type: question.answerType,
          question: question.question,
          draggableNodes: draggableNodes,
          answers: answers,
          countdown: question.customCountdown || 15_000
        }
        break;
    }

    res.write(getMessage(id++, 'question', questionForPlayer))
  })

  game.onCountdownEnd(() => {
    res.write(getMessage(id++, 'countdownEnd'))
  })

  game.onResult(() => {
    const results = game.getPlayerByUsername(username)?.answers[game.questionIndex]
    res.write(getMessage(id++, 'result', results))
  })

  game.onceSummary((summary) => {
    res.end(getMessage(id, 'summary', summary))
  })

  
}




function isUsernameValid(username: string) {
  if (username.length > 12) return false
  if (username.length < 3)  return false
  if (/\W/.test(username))  return false

  return true
}


export function joinPlayer(req: Request, res: Response) 
{
  const { gameFromJoinCode, gameFromSessGameID } = req
  const { username } = req.body

  if (!gameFromJoinCode || !gameFromJoinCode.isJoiningPossible()) {
    res.status(404).json({
      status: 'notFound'
    })
    return;
  }

  if (typeof username !== 'string' || !isUsernameValid(username)) {
    res.status(400).json({
      status: 'invalidUsername'
    })
    return;
  }

  if (gameFromSessGameID) {
    if (gameFromSessGameID === gameFromJoinCode) {
      res.status(200).json({
        status: 'alreadyInThisGame'
      })
      return;
    }
    res.status(403).json({
      status: 'alreadyInAnotherGame'
    })
    return;
  }

  if (gameFromJoinCode.whetherUsernameIsAlreadyUse(username)) {
    res.status(403).json({
      status: 'non-uniqueUsername'
    })
    return;
  }

  if (gameFromJoinCode.isJoiningPossible()) {
    if (gameFromJoinCode.join(username)) {
      req.session.gameID = gameFromJoinCode.gameID
      req.session.username = username
      res.json({
        status: 'success'
      })
      return;
    }
    throw new AppError(
      'Something went wrong. Please try again',
      'unknown',
      500
    )
  }
}


export function answer(req: Request, res: Response) 
{
  const { gameFromSessGameID: game } = req
  const { username } = req.session
  const answer: Answer = req.body
  
  if (!game || !username) return; // just for typescript
  // error handling was dane by requestGameData middleware

  const player = game.getPlayerByUsername(username)!

  if (game.isWaitingForResponse) {
    if (game.questionIndex === answer?.questionIndex) {
      if (game.questions[game.questionIndex].answerType === answer.type) {
        player.answers[game.questionIndex] = answer
      }
    }
  }
}


export function createGame(req: Request, res: Response) 
{
  const HOST_SECRET = process.env.HOST_SECRET
  const hostSecretFromUser = req.body.hostSecret

  const questionSet: Question[] = [
    {
      answerType: 'multipleChoice',
      question: 'Select all greetings',
      choiceAnswers: [
        { content: 'Dzień dobry', isCorrect: true },
        { content: 'Do widzenia', isCorrect: false },
        { content: 'Smacznego', isCorrect: false},
        { content: 'Cześć', isCorrect: true }
      ],
    },
    {
      answerType: 'singleChoice',
      question: 'How to say „I drink water” in Polish?',
      choiceAnswers: [
        { content: 'Piję wodę', isCorrect: true },
        { content: 'Dzień dobry', isCorrect: false },
        { content: 'Smacznego', isCorrect: false},
        { content: 'Do widzenia', isCorrect: false }
      ]
    },
    {
      answerType: 'dragAndDrop',
      question: 'Match Polish translations',
      dragAndDropAnswers: [
        [
          { content: 'Good morning', isDraggable: false },
          { content: 'Dzień dobry', isDraggable: true }
        ],
        [
          { content: 'Have a nice day', isDraggable: false },
          { content: 'Miłego dnia', isDraggable: true }
        ],
        [
          { content: 'Hi', isDraggable: false },
          { content: 'Cześć', isDraggable: true }
        ],
        [
          { content: 'Goodbye', isDraggable: false },
          { content: 'Do widzenia', isDraggable: true }
        ]
      ]
    },
    {
      answerType: 'singleChoice',
      question: 'Which word IS NOT a variation of the word „jeść”?',
      choiceAnswers: [
        { content: 'jem', isCorrect: false },
        { content: 'jedzono', isCorrect: false},
        { content: 'jesteśmy', isCorrect: true },
        { content: 'jedliśmy', isCorrect: false }
      ]
    },
    {
      answerType: 'singleChoice',
      question: 'How to say „I love animals” in Polish?',
      choiceAnswers: [
        { content: 'Pieję wodę', isCorrect: false },
        { content: 'Kocham zwierzęta', isCorrect: true },
        { content: 'Do widzenia', isCorrect: false},
        { content: 'Konstantynopolitańczykowianeczka', isCorrect: false }
      ]
    },
    {
      answerType: 'dragAndDrop',
      question: 'Insert the appropriate words into the sentences',
      dragAndDropAnswers: [
        [
          { content: 'Good morning', isDraggable: false },
          { content: 'Dzień dobry', isDraggable: true }
        ],
        [
          { content: 'Have a nice day', isDraggable: false },
          { content: 'Miłego dnia', isDraggable: true }
        ],
        [
          { content: 'Hi', isDraggable: false },
          { content: 'Cześć', isDraggable: true }
        ],
        [
          { content: 'Goodbye', isDraggable: false },
          { content: 'Do widzenia', isDraggable: true }
        ]
      ]
    },
    {
      answerType: 'multipleChoice',
      question: 'Select all goodbyes',
      choiceAnswers: [
        { content: 'Dzień dobry', isCorrect: true },
        { content: 'Do widzenia', isCorrect: false },
        { content: 'Smacznego', isCorrect: false},
        { content: 'Cześć', isCorrect: true }
      ]
    }
  ]
  const questionSetName = 'Basics of Polish'

  if (hostSecretFromUser === HOST_SECRET) {
    const game = createNewGame(questionSet, questionSetName)

    req.session.gameID = game.gameID
    req.session.isHost = true

    res.json({
      status: 'success',
      joinCode: game.joinCode
    })
  } else {
    res.json({
      status: 'invalidSecret'
    })
  }
}


export function startGame(req: Request, res: Response)
{
  const { gameFromSessGameID: game } = req
  const { isHost } = req.session
  
  if (isHost && game) {
    game.start()

    res.json({
      status: 'success'
    })
  }
}