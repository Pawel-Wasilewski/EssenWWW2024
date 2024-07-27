import { Request } from '@types/express-serve-static-core'
import Game from '../services/game.ts'

declare global {
  namespace Express {
    export interface Request {
      gameFromJoinCode?:   Game | false | undefined;
      gameFromSessGameID?: Game | false | undefined;
    }
  }
}