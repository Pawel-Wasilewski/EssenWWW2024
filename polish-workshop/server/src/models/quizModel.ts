import { UUID } from "crypto";
import Game, { Question } from "../services/game.js";

const games: Game[] = []

export function createNewGame(questionSet: Question[], questionSetName: string) {
  const game = new Game(questionSet, questionSetName)
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