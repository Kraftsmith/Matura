import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { validateLanguageUseExercises } from './src/data/languageUseExercises.ts'

/** Stops the build on an exercise with a broken key. */
const checkLanguageUseExercises = (): Plugin => ({
  name: 'check-language-use-exercises',
  buildStart() {
    const problems = validateLanguageUseExercises()
    if (problems.length) this.error(`Środki językowe:\n${problems.join('\n')}`)
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), checkLanguageUseExercises()],
})
