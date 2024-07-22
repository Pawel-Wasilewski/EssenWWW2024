import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import Home from './pages/Home'
import Quiz from './pages/Quiz'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path='/'>
          <Route index element={ <Home /> } />
          <Route path='flashcards' />
          <Route path='quiz' >
            <Route index element={ <Quiz /> } />
            <Route path=':joinCode' element={ <Quiz /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App