import { Router } from "express";
import { 
  getGameData,
  getGameDataWithJoinCode
} from "../controllers/quizController.js";

function quiz() {
  const api = Router()

  api.get('/game', getGameData)

  api.get('/game/:joinCode', getGameDataWithJoinCode)

  api.get('/stream/:joinCode')

  return api
}

export default quiz
