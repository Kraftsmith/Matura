import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './settings'
import { UserProvider } from './user'
import { ProgressProvider } from './progress'
import { TeacherCardsProvider } from './teacherCards'
import { ScheduleProvider } from './scheduleProvider'
import { NotificationsProvider } from './notificationsProvider'
import { validateLanguageUseExercises } from './data/languageUseExercises'

if (import.meta.env.DEV) validateLanguageUseExercises().forEach((problem) => console.error(problem))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <UserProvider>
        <ProgressProvider>
          <TeacherCardsProvider>
            <ScheduleProvider>
              <NotificationsProvider>
                <App />
              </NotificationsProvider>
            </ScheduleProvider>
          </TeacherCardsProvider>
        </ProgressProvider>
      </UserProvider>
    </SettingsProvider>
  </StrictMode>,
)
