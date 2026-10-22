import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const nuxtVersion = process.env.NUXT_VERSION
if (!nuxtVersion) throw new Error('NUXT_VERSION is required (for example 3.21.11 or 4.6.2)')

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const consumerDir = mkdtempSync(join(tmpdir(), `gsap-nuxt-${nuxtVersion}-`))

function run(command: string[], cwd = consumerDir) {
  const process = spawnSync(command[0]!, command.slice(1), { cwd, stdio: 'inherit' })
  if (process.status !== 0) throw new Error(`${command.join(' ')} failed with exit code ${process.status}`)
}

const pack = spawnSync(
  'npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', consumerDir],
  { cwd: rootDir, encoding: 'utf8' },
)
if (pack.status !== 0) throw new Error(pack.stderr || 'npm pack failed')
const packed = JSON.parse(pack.stdout) as Array<{ filename: string }>
const filename = packed[0]?.filename
if (!filename) throw new Error('npm pack did not return a tarball filename')

writeFileSync(join(consumerDir, 'package.json'), JSON.stringify({
  private: true,
  type: 'module',
  scripts: {
    build: 'nuxt build',
    typecheck: 'nuxt typecheck',
  },
}, null, 2))
writeFileSync(join(consumerDir, 'nuxt.config.ts'), `export default defineNuxtConfig({
  modules: ['gsap-nuxt-module'],
  gsap: { plugins: ['ScrollSmoother', 'Flip'] },
})\n`)
writeFileSync(join(consumerDir, 'tsconfig.json'), JSON.stringify({
  extends: './.nuxt/tsconfig.json',
}, null, 2))
writeFileSync(join(consumerDir, 'app.vue'), `<script setup lang="ts">
const gsap = useGsap()
const ScrollSmoother = useScrollSmoother()
const Flip = useFlip()
void [gsap, ScrollSmoother, Flip]
</script>

<template><main>Nuxt compatibility fixture</main></template>
`)

run([
  'bun', 'add',
  `nuxt@${nuxtVersion}`,
  'typescript@^6.0.0',
  'vue-tsc@^3.0.0',
  join(consumerDir, filename),
])
run(['bunx', 'nuxi', 'prepare'])
run(['bun', 'run', 'typecheck'])
run(['bun', 'run', 'build'])

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesIn(path) : [path]
  })
}

const clientOutput = filesIn(join(consumerDir, '.output/public/_nuxt'))
  .filter(path => path.endsWith('.js'))
  .map(path => readFileSync(path, 'utf8'))
  .join('\n')
for (const plugin of ['ScrollTrigger', 'ScrollSmoother', 'Flip']) {
  if (!clientOutput.includes(plugin)) throw new Error(`Compatibility fixture did not bundle ${plugin}`)
}

console.log(`Nuxt ${nuxtVersion} consumer compatibility passed.`)
