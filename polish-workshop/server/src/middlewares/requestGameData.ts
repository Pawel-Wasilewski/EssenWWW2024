import { NextFunction, Request, Response } from "express";
import Game from "../services/game.js";
import { getGameByJoinCode, getGameByID } from "../models/quizModel.js";
import { AppError } from "./errors.js";

export function requestGameData(options?: {
  requireJoinCode?:            boolean | 'toBeCorrect';
  requireSessionGameID?:       boolean | 'toBeCorrect';
  requireUsername?:            boolean;
  strictDataIntegrityControl?: boolean;
  forbidHosts?:                boolean;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { joinCode } = req.params
    const { 
      gameID: sessGameID, 
      username, 
      isHost
    } = req.session
  
    let gameFromJoinCode:      Game | false | undefined
    let gameFromSessionGameID: Game | false | undefined
  
    if (joinCode) gameFromJoinCode = getGameByJoinCode(joinCode) || false
    if (sessGameID) gameFromSessionGameID = getGameByID(sessGameID) || false
  
    req.gameFromJoinCode = gameFromJoinCode
    req.gameFromSessGameID = gameFromSessionGameID

    if (options?.forbidHosts) {
      if (isHost) {        
        throw new AppError(
          'The host has no access here',
          'forbidHost',
          403
        )
      }
    }

    if (options?.requireJoinCode || options?.strictDataIntegrityControl) {
      if (gameFromJoinCode === undefined) {
        throw new AppError(
          'Your joinCode is not provided',
          'joinCodeNotProvided',
          400
        )
      }
      if (options.requireJoinCode === 'toBeCorrect' || options?.strictDataIntegrityControl) {
        if (!gameFromJoinCode) {
          throw new AppError(
            'Please provide correct joinCode',
            'incorrectJoinCode',
            404
          )
        }
      }
    }

    if (options?.requireSessionGameID || options?.strictDataIntegrityControl) {
      if (gameFromJoinCode === undefined) {
        throw new AppError(
          'Your session is not provided',
          'sessionNotProvided',
          400
        )
      }
      if (options?.requireSessionGameID === 'toBeCorrect' || options?.strictDataIntegrityControl) {
        if (!gameFromSessionGameID) {
          throw new AppError(
            'Your session is incorrect',
            'incorrectSession',
            404
          )
        }
      }
    }

    if (options?.requireUsername) {
      if (!username) {
        throw new AppError(
          'Username is not included in session',
          'usernameMissingInSession',
          500
        )
      }
    }

    if (options?.strictDataIntegrityControl) {
      if (gameFromJoinCode !== gameFromSessionGameID) {
        throw new AppError(
          'Your joinCode is pointing different game from session gameID',
          'discrepancy',
          400
        )
      }
      if (options?.requireUsername && username) {
        if (gameFromSessionGameID && !gameFromSessionGameID.getPlayerByUsername(username)) {
          throw new AppError(
            'Username is not used in this game',
            'incorrectUsername',
            500
          )
        }
      }
    }
  
    next()
  }
}
