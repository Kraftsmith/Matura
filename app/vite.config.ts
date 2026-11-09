import { defineConfig, type Plugin } from 'vitest/config'
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
  // The public site (../site) is the root of dist/; the app is served under /app/ on the same host (Spec - Landing §13).
  base: '/app/',
  build: { outDir: 'dist/app', emptyOutDir: true },
  plugins: [react(), tailwindcss(), checkLanguageUseExercises()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'api/**/*.test.ts'],
  },
})
