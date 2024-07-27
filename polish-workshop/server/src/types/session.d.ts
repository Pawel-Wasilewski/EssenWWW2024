import { UUID } from "crypto";
import { SessionData } from "@types/express-session";

declare module "express-session" {
  export interface SessionData {
    gameID?: UUID;
    username?: string;
    isHost?: boolean;
  }
}
