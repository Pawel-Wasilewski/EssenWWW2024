import { UUID } from "crypto";
import Game, { Question } from "../services/game.js";


const questions: Question[] = [
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


const games: Game[] = [ new Game(questions) ]


export function createNewGame(questions: Question[]) {
  const game = new Game(questions)
  games.push(game)

  return game
}

export function getGameByJoinCode(joinCode: string) {
  return games.find((game) => {
    return joinCode === game.joinCode
  })
}

export function getGameByID(gameID: UUID) {
  return games.find((game) => {
    return gameID === game.gameID
  })
}