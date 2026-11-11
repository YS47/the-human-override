import { readFileSync, readdirSync } from 'node:fs'

const styles = readdirSync('src', { recursive: true }).filter(path => path.endsWith('.css'))
const forbidden = /\b(?:repeating-)?(?:linear|radial|conic)-gradient\s*\(/i
const violations = styles.filter(path => forbidden.test(readFileSync('src/' + path, 'utf8')))

if (violations.length) {
  console.error('Use solid colors in authored presentation styles. Check ' + violations.join(', '))
  process.exitCode = 1
}
