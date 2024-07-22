import { Request, Response } from "express"


function getGameData(req: Request, res: Response) {

}

function getGameDataWithJoinCode(req: Request, res: Response) {
  const { joinCode } = req.params


}

export {
  getGameData,
  getGameDataWithJoinCode
}