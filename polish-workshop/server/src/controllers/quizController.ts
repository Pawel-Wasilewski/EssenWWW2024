import { NextFunction, Request, Response } from "express"
import { getGameByJoinCode, getGameByID } from "../models/quizModel.js"
import { UUID } from "crypto"
import Game from "../services/game.js"
import { AppError } from "../middlewares/errors.js"


type GameProperties = {
  // TODO
}

type PlayerProperties = {
  // TODO
}

type CorrectSessionGameDataResponse = {
  status: 'inGame' | 'discrepancy' | 'incorrectJoinCode';
  gameProperties: GameProperties;
  playerProperties: PlayerProperties;
}

type IncorrectSessionGameDataResponse = {
  status: 'notFound' | 'joinPossible';
}

type GameDataResponse = CorrectSessionGameDataResponse | IncorrectSessionGameDataResponse

export function getGameData(req: Request, res: Response) 
{
  const { gameFromJoinCode, gameFromSessGameID } = req

  if (gameFromSessGameID) {

    if (gameFromJoinCode === false) {
      const gameProperties = {}
      const playerProperties = {}
      
      const gameDataResponse: GameDataResponse = {
        status: 'incorrectJoinCode',
        gameProperties: gameProperties,
        playerProperties: playerProperties
      }

      res.status(200).json(gameDataResponse)
      return;
    }

    if (gameFromJoinCode === undefined || gameFromJoinCode === gameFromSessGameID) {
      const gameProperties = {}
      const playerProperties = {}

      const gameDataResponse: GameDataResponse = {
        status: 'inGame',
        gameProperties: gameProperties,
        playerProperties: playerProperties
      }

      res.status(200).json(gameDataResponse)
      return;
    }

    if (gameFromJoinCode !== gameFromSessGameID) {
      const gameProperties = {}
      const playerProperties = {}

      const gameDataResponse: GameDataResponse = {
        status: 'discrepancy',
        gameProperties: gameProperties,
        playerProperties: playerProperties
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
  const { gameFromJoinCode, gameFromSessGameID } = req

  let id = 0;

  function getMessage(id: number, event: string, data?: any) {
    return (
      'id:' + id++ + '\n' +
      'event:' + event + '\n' +
      'data:' + (JSON.stringify(data) || '') + '\n\n'
    )
  }

  if (!gameFromJoinCode || !gameFromSessGameID) return; // just for typescript
  // error handling was dane by requestGameData middleware

  const game = gameFromSessGameID
  
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

  game.onResult((result) => {
    res.write(getMessage(id++, 'result', result))
  })

  game.onceSummary((summary) => {
    res.end(getMessage(id, 'summary', summary))
  })

  game?.start()
}




function isUsernameValid(username: string) {
  if (username.length > 12) return false
  if (username.length < 3)  return false
  if (/\W/.test(username))  return false

  return true
}


export function joinPlayer(req: Request, res: Response, next: NextFunction) 
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
