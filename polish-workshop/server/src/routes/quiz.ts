import { Router } from "express";
import { 
  answer, 
  createGame, 
  getGameData, 
  getGameEventsStream, 
  joinPlayer, 
  startGame 
} from "../controllers/quizController.js";
import { requestGameData } from "../middlewares/requestGameData.js";

function quiz() {
  const api = Router();

  api.get('/status', requestGameData(), getGameData)
  api.get('/status/:joinCode', requestGameData(), getGameData)
  api.get('/game-event-stream/:joinCode', requestGameData({
    requireUsername: true,
    strictDataIntegrityControl: true,
    forbidHosts: true
  }), getGameEventsStream)
  api.post('/join/:joinCode', requestGameData({
    forbidHosts: true
  }), joinPlayer)
  api.post('/answer/:joinCode', requestGameData({
    requireUsername: true,
    strictDataIntegrityControl: true,
    forbidHosts: true
  }), answer)
  api.post('/host', createGame)
  api.post('/host/:joinCode/start', requestGameData({
    strictDataIntegrityControl: true
  }), startGame)

  return api;
}

export default quiz;
