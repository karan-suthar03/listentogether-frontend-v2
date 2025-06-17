import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css'
import LandingPage from './components/LandingPage'
import RoomPage from './components/RoomPage'
import JoinRoomPage from './components/JoinRoomPage'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/join/:roomId" element={<JoinRoomPage/>}/>
                <Route path="/room/:roomId" element={<RoomPage/>}/>
            </Routes>
        </Router>
    </StrictMode>,
)
