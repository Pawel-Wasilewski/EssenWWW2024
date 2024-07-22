import { useEffect, useReducer, useState } from "react"
import { useParams } from "react-router-dom"
import QuizJoinCodeForm from "../components/QuizJoinCodeForm"
import QuizUsernameForm from "../components/QuizUsernameForm"
import WaitingRoom from "../components/WaitingRoom"
import QuizGame from "../components/QuizGame"
import DiscrepancyModal from "../components/DiscrepancyModal"

type GameData = {
  /**
   * Possible game statuses:
   * | Status          | Description                                                             | When can it be returned?                                                                    | Access to other properties
   * | -               | -                                                                       | -                                                                                           | -
   * | 'enterName'     | Server doesn't have your username. you have to submit it                | Correct session and `joinCode` points to the same game or doesn't exist                     | `gameProperties`
   * | 'inWaitingRoom' | You are waiting for host to start game                                  | Correct session and `joinCode` points to the same game or doesn't exist                     | `gameProperties` and `playerProperties`
   * | 'continues'     | The game is in progress                                                 | Correct session and `joinCode` points to the same game or doesn't exist                     | `gameProperties` and `playerProperties`
   * | 'finished'      | The game is ended, but host didn't close the game                       | Correct session and `joinCode` points to the same game or doesn't exist                     | `summaryProperties`
   * | 'joinPossible'  | You can join to the Game using `joinCode`                               | Incorrect or doesn't provided session and `JoinCode` belongs to the game you have access to |
   * | 'discrepancy'   | You can't join using actual session                                     | Correct session and `joinCode` points different game                                        |
   * | 'notFound'      | The game doesn't exist, has been closed, or you don't have access to it | Incorrect session or incorrect `JoinCode` or you don't have access                          |
   * | 'unknown'       | Client has not yet received a response from the server                  |                                                                                             |
   */
  status: 'enterName'    | 'inWaitingRoom' | 'continues' | 'finished' |
          'joinPossible' | 'discrepancy'   | 'notFound'  | 'unknown',       
  gameProperties?: {
    joinCode: string,
    maxAnswers: number
  },
  playerProperties?: {
    username: string,
    playerPoints: number,
    correctAnswers: number
  },
  summaryProperties?: {
    maxAnswers: number,
    messagePL: string,
    messageEN: string,
    usersPoints: { username: string, points: number }[]
  }
}


function setGameReducer(state: GameData, data: GameData): GameData 
{
  return { ...state, ...data }
}


async function getGameProperties(joinCode?: string) 
{
  let url = '/api/quiz/game'

  if (joinCode?.length === 6) url += ('/' + joinCode)

  const result = await fetch(url , {
    method: 'GET'
  })

  if (!result.ok) return false

  const jsonData: GameData = await result.json()

  return jsonData
}


// async function processGameEventStream(url: string) 
// {
//   return new Promise<void>((resolve, reject) => {
//     const gameStream = new EventSource(url)

//     gameStream.addEventListener('open', () => resolve())
//     gameStream.addEventListener('error', () => reject())

//     gameStream.addEventListener('countdown', () => {})
//     gameStream.addEventListener('question', () => {})
//     gameStream.addEventListener('result', () => {})
//     gameStream.addEventListener('gameSummary', () => {})
//   })
// }


function Quiz() 
{
  const [ showDiscrepancyModal, setShowDiscrepancyModal ] = useState(false)
  const { joinCode } = useParams()
  const [ gameProps, setGameProps ] = useReducer(setGameReducer, {
    status: 'unknown'
  })
  useEffect(() => {
    (async ()=>{
      const fetchedGameProps = await getGameProperties()
      if (fetchedGameProps) setGameProps(fetchedGameProps)
    })()
  }) // Getting information about game connected with used session ID
  useEffect(() => {
    if (joinCode) {
      (async ()=>{
        const fetchedGameProps = await getGameProperties(joinCode)
        if (fetchedGameProps) {
          if (fetchedGameProps.status === 'discrepancy') {
            setShowDiscrepancyModal(true)
          }
        }
      })()
    }
  }, [ joinCode ]) // Getting information about game connected with joinCode

  return (
    <>
      { gameProps.status === 'notFound' && <QuizJoinCodeForm /> }
      { gameProps.status === 'enterName' && <QuizUsernameForm /> }
      { gameProps.status === 'inWaitingRoom' && <WaitingRoom /> }
      { gameProps.status === 'continues' && <QuizGame /> }
      { showDiscrepancyModal && <DiscrepancyModal /> }

    </>
  )
}



export default Quiz
