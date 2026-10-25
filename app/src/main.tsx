import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './settings'
import { UserProvider } from './user'
import { ProgressProvider } from './progress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <UserProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </UserProvider>
    </SettingsProvider>
  </StrictMode>,
)
