import { Router } from "express";
import { getGameData, getGameEventsStream, joinPlayer } from "../controllers/quizController.js";
import { requestGameData } from "../middlewares/requestGameData.js";

function quiz() {
  const api = Router();

  api.get('/status', requestGameData(), getGameData)
  api.get('/status/:joinCode', requestGameData(), getGameData)
  api.get('/game-event-stream/:joinCode', requestGameData({
    strictDataIntegrityControl: true
  }), getGameEventsStream)
  api.post('/join/:joinCode', requestGameData(), joinPlayer)
  api.post('/answer/:joinCode', requestGameData())

  return api;
}

export default quiz;
