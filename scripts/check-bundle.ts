import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
function filesIn(directory: string): string[] {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesIn(path) : [path]
  })
}

function buildFixture(name: string) {
  const fixtureDir = join(rootDir, 'test/fixtures', name)
  const process = spawnSync('bunx', ['nuxi', 'build', fixtureDir], {
    cwd: rootDir,
    stdio: 'inherit',
  })
  if (process.status !== 0) throw new Error(`Nuxt build failed for ${name}`)
  return fixtureDir
}

function clientJavaScript(fixtureDir: string) {
  return filesIn(join(fixtureDir, '.output/public/_nuxt'))
    .filter(path => path.endsWith('.js'))
    .map(path => readFileSync(path, 'utf8'))
    .join('\n')
}

function clientJavaScriptBytes(fixtureDir: string) {
  return filesIn(join(fixtureDir, '.output/public/_nuxt'))
    .filter(path => path.endsWith('.js'))
    .reduce((total, path) => total + statSync(path).size, 0)
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const basicDir = buildFixture('basic')
const basicPlugin = join(basicDir, '.nuxt/gsap-nuxt-module/plugin.client.mjs')
assert(!existsSync(basicPlugin), 'The zero-plugin fixture generated a client registration plugin')
const basicBytes = clientJavaScriptBytes(basicDir)
assert(basicBytes <= 150 * 1024, `Zero-plugin client JavaScript is ${basicBytes} bytes; budget is 153600 bytes`)

const selectedDir = buildFixture('with-plugins')
const selectedOutput = clientJavaScript(selectedDir)
for (const plugin of ['ScrollTrigger', 'ScrollSmoother', 'Flip']) {
  assert(selectedOutput.includes(plugin), `Selected client bundle does not contain ${plugin}`)
}
for (const plugin of ['Draggable', 'CustomWiggle', 'DrawSVGPlugin']) {
  assert(!selectedOutput.includes(plugin), `Selected client bundle unexpectedly contains ${plugin}`)
}

const distBytes = filesIn(join(rootDir, 'dist'))
  .reduce((total, path) => total + statSync(path).size, 0)
assert(distBytes <= 40 * 1024, `Package dist is ${distBytes} bytes; budget is 40960 bytes`)

console.log(`Bundle checks passed; package dist is ${distBytes} bytes.`)
