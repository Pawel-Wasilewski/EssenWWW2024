type SingleChoiceAnswer = {
  type: 'singleChoice';
  playerAnswer: string; 
}
type MultiChoiceAnswer = {
  type: 'multipleChoice';
  playerAnswer: string[]; 
}
type DragAndDropAnswer = {
  type: 'dragAndDrop';
  playerAnswer: string[][];
}
export type Answer = (SingleChoiceAnswer | MultiChoiceAnswer | DragAndDropAnswer) & {
  questionIndex: number;
  isCorrect?: boolean;
  points?: number;
} | undefined


class Player {
  private _username: string
  private _answers: Answer[] = []

  public constructor(username: string) {
    this._username = username
  }

  public getPoints() {
    let points = 0

    this.answers.forEach((answer) => {
      if (answer?.points) points += answer.points
    })

    return points
  }

  public get username() {
    return this._username
  }
  
  public get answers() {
    return this._answers
  }
  
}

export default Player
