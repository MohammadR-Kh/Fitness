import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SignUp from './pages/sign-up/sign-up'
import Main from './pages/main/main'
import SignIn from './pages/sign-in/sign-in'
import Workouts from './pages/workouts/workouts'
import Diet from './pages/diet/diet'
import Goals from './pages/goals/goals'
import Profile from './pages/profile/profile'
import Dashboard from './pages/dashboard/dashboard'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/' element={<Main />} >
            <Route index element={<Dashboard />} />
            <Route path='/workouts' element={<Workouts />} />
            <Route path='/diet' element={<Diet />} />
            <Route path='/goals' element={<Goals />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
