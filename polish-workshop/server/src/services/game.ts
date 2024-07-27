import { randomUUID, UUID } from "crypto";
import EventEmitter from "events";
import Player, { Answer } from "./player.js";

type ChoiceQuestion = {
  answerType: 'multipleChoice' | 'singleChoice';
  question: string;
  customCountdown?: number;
  choiceAnswers: {
    isCorrect: boolean;
    content: string;
  }[]
}

type DragAndDropQuestion = {
  answerType: 'dragAndDrop';
  question: string;
  customCountdown?: number;
  dragAndDropAnswers: {
    isDraggable: boolean;
    content: string;
  }[][];
}

export type Question = ChoiceQuestion | DragAndDropQuestion


class Game extends EventEmitter 
{
  public readonly gameID: UUID
  public readonly joinCode: string
  public readonly numberOfQuestions: number
  public readonly questionsSetName: string

  private readonly _questions: Question[]
  private _questionIndex = 0
  private _players: Player[] = []
  private _status: 'waitingRoom' | 'continues' | 'finished'
  private _isWaitingForResponse = false
  
  public constructor(questions: Question[], questionsSetName: string) {
    super()

    this.gameID = randomUUID() 
    this.joinCode = Game.getRandomJoinCode()
    this._questions = questions
    this.questionsSetName = questionsSetName
    this.numberOfQuestions = this._questions.length
    this._status = 'waitingRoom'

    console.log(this.joinCode)
  }


  public onPlayerJoined(callback: (player: Player) => void) {
    this.on('playerJoined', callback)
  }

  public onceStart(callback: (game: Game) => void) {
    this.once('start', callback)
  }

  public onQuestion(callback: (question: Question) => void) {
    this.on('question', callback)
  }

  public onCountdownEnd(callback: () => void) {
    this.on('countdownEnd', callback)
  }

  public onResult(callback: () => void) {
    this.on('result', callback)
  }

  public onceSummary(callback: (players: Player[]) => void) {
    this.once('summary', callback)
  }


  public join(username: string) {
    if (!this.isJoiningPossible()) return false
    if (this.whetherUsernameIsAlreadyUse(username)) return false

    const player = new Player(username)
    this.players.push( player )

    this.emit('playerJoined', player)

    return true
  }

  public start() {
    this._status = 'continues'
    this.emit('start', {
      questionIn: 2_000
    })

    setTimeout(() => this.question(), 2_000)
  }

  private question() {
    const question = this.questions[this.questionIndex]
    const defaultCountdown = 15_000

    this._isWaitingForResponse = true
    this.emit('question', question)

    setTimeout(() => {
      this.countdownEnd()
    }, question.customCountdown || defaultCountdown)
  }

  private countdownEnd() {
    this.emit('countdownEnd')
    this._isWaitingForResponse = false

    this.verifyAnswers()
    this.result()
  }

  private result() {
    this.emit('result', this.players)

    setTimeout(() => {
      if (this.questionIndex + 1 >= this.numberOfQuestions) {
        this.summary()
      } else {
        this.nextQuestion()
      }
    }, 3_000)
  }

  private nextQuestion() {
    this._questionIndex++
    this.question()
  }

  private summary() {
    this.emit('summary', this.players)
  }


  private verifyAnswers() {
    this.players.forEach((player) => {
      const playerAnswer: Answer = player.answers[this.questionIndex]
      const question = this.questions[this.questionIndex]

      if (!playerAnswer) return;

      switch (question.answerType) {
        case 'singleChoice': {
          if (playerAnswer.type !== question.answerType) return;

          const pAnswer = playerAnswer.playerAnswer

          const isCorrect = question.choiceAnswers
            .filter((choiceAnswers) => choiceAnswers.isCorrect)
            .every((answer) => answer.content === pAnswer)

          playerAnswer.isCorrect = isCorrect
          break;
        }  
          
        case 'multipleChoice': {
          if (playerAnswer.type !== question.answerType) return;
          
          const sortedPlayerAnswer = playerAnswer.playerAnswer.sort()

          const isCorrect = question.choiceAnswers
            .filter((choiceAnswers) => choiceAnswers.isCorrect)
            .map((correctAnswer) => correctAnswer.content)
            .sort()
            .every((answer, index) => answer === sortedPlayerAnswer[index])

          playerAnswer.isCorrect = isCorrect
          break;
        }

        case 'dragAndDrop': {
          if (playerAnswer.type !== question.answerType) return;

          const isCorrect = question.dragAndDropAnswers.every((row, rowIndex) => row
            .filter((node) => node.isDraggable)
            .every((draggableNode, nodeIndex) => draggableNode.content === playerAnswer.playerAnswer[rowIndex][nodeIndex])
          )

          playerAnswer.isCorrect = isCorrect
          break;
        }
      }
    })
  }


  public isJoiningPossible() {
    return this.status === 'waitingRoom'
  }

  public whetherUsernameIsAlreadyUse(username: string) {
    const usernameIndex = this.players.findIndex((player) => {
      return player.username === username
    })

    return usernameIndex !== -1
  }

  public get status() {
    return this._status
  }
  
  public get isWaitingForResponse() {
    return this._isWaitingForResponse
  }

  public get questions() {
    return this._questions
  }
  
  public get questionIndex() {
    return this._questionIndex
  }
  
  public get players() {
    return this._players
  }

  public getPlayerByUsername(username: string) {
    return this.players.find((player) => player.username === username)
  }
  

  private static getRandomJoinCode() {
    let joinCode = ''

    for (let i = 0; i < 6; i++) {
      joinCode += Math.round(Math.random() * 35).toString(36).toUpperCase()
    }

    return joinCode
  }
}

export default Game
