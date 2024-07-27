type SingleChoiceAnswer = {
  // TODO
}

type MultiChoiceAnswer = {
  // TODO
}

type DragAndDropAnswer = {
  // TODO
}

type Answer = SingleChoiceAnswer | MultiChoiceAnswer | DragAndDropAnswer


class Player {
  private _username: string
  private _answers: Answer[] = []

  public constructor(username: string) {
    this._username = username
  }

  public get username() {
    return this._username
  }
  
  public get answers() {
    return this._answers
  }
  
}

export default Player
