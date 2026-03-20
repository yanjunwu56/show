import { execSync } from 'node:child_process'

// Monorepo runner: loops through each workspace and executes a script.
// This keeps build/lint/format commands centralized in the repo root.
const workspaces = ['vue3-admin', 'react-admin']
const script = process.argv[2]

if (!script) {
  console.error('Usage: node scripts/run-workspaces.mjs <script>')
  process.exit(1)
}

for (const workspace of workspaces) {
  // Running sequentially makes logs easier to read.
  execSync(`npm run ${script} -w ${workspace}`, { stdio: 'inherit' })
}
