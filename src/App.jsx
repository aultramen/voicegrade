import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './contexts/LangContext'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import SetupPage from './pages/SetupPage'
import SessionPage from './pages/SessionPage'
import ReviewPage from './pages/ReviewPage'

// Use MemoryRouter for desktop (no URL bar in Tauri window)
export default function App() {
    return (
        <LangProvider>
            <MemoryRouter initialEntries={['/']} initialIndex={0}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/setup/:id" element={<SetupPage />} />
                    <Route path="/session/:id" element={<SessionPage />} />
                    <Route path="/review/:id" element={<ReviewPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MemoryRouter>
        </LangProvider>
    )
}
