// Runs before `npm run build` (npm "prebuild"). It stops the build with a clear message when the project was uploaded incompletely,
// instead of failing later with an unclear TypeScript or Vite error. It changes nothing and needs no dependencies.
import fs from 'node:fs'

const count = (dir, test) => (fs.existsSync(dir) ? fs.readdirSync(dir, { recursive: true }).filter((f) => test(String(f))).length : 0)
const code = count('src', (f) => f.endsWith('.ts') || f.endsWith('.tsx'))
const need = ['index.html', 'vite.config.ts', 'tsconfig.json', 'tailwind.config.js', 'src/main.tsx', 'src/App.tsx', 'src/index.css', 'src/types/index.ts',
  'src/assets/fonts/AlbertSans-Variable.ttf', 'src/assets/fonts/AeonikPro-Regular.otf', 'src/data/index.ts', 'src/lib/repo.ts']
const missing = need.filter((f) => !fs.existsSync(f))
const art = count('src/assets/art', (f) => f.endsWith('.jpg'))
const problems = []
if (code < 100) problems.push(`src/ has only ${code} TypeScript files (about 114 expected)`)
if (missing.length) problems.push(`missing files: ${missing.join(', ')}`)
if (art < 100) problems.push(`src/assets/art has only ${art} images (about 200 expected)`)

if (problems.length) {
  console.error(`\n*** INCOMPLETE UPLOAD ***\n${problems.map((p) => ' - ' + p).join('\n')}\n` +
    'The project is missing files, so it cannot be built. Upload the complete project with GitHub Desktop or git:\n' +
    'the GitHub web uploader silently skips every file beyond 100 per upload. See README.md, section "If the build fails".\n')
  process.exit(1)
}
console.log(`Project check passed: ${code} TypeScript files, ${art} artwork images.`)
