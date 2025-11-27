const fs = require('fs')
const path = require('path')

function parseLcov(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  let total = 0
  let covered = 0
  for (const line of lines) {
    if (line.startsWith('LF:')) {
      total += parseInt(line.slice(3), 10) || 0
    }
    if (line.startsWith('LH:')) {
      covered += parseInt(line.slice(3), 10) || 0
    }
  }
  return { total, covered, content }
}

function main() {
  if (process.argv.length < 5) {
    console.error('Usage: node merge-lcov.js <lcov1> <lcov2> <outFile>')
    process.exit(2)
  }
  const [, , a, b, out] = process.argv
  const aPath = path.resolve(a)
  const bPath = path.resolve(b)
  if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) {
    console.error('One or both lcov files not found:', aPath, bPath)
    process.exit(3)
  }
  const aCov = parseLcov(aPath)
  const bCov = parseLcov(bPath)
  const total = aCov.total + bCov.total
  const covered = aCov.covered + bCov.covered
  const pct = total === 0 ? 0 : Math.round((covered / total) * 100)

  // Write combined lcov file by concatenating contents (preserve records)
  const combinedLcovPath = out.endsWith('.info') || out.endsWith('.lcov') ? out : out + '.info'
  const combinedDir = path.dirname(combinedLcovPath)
  if (!fs.existsSync(combinedDir)) fs.mkdirSync(combinedDir, { recursive: true })
  const combinedContent = [aCov.content.trim(), bCov.content.trim()].filter(Boolean).join('\n') + '\n'
  fs.writeFileSync(combinedLcovPath, combinedContent, 'utf8')

  // Write metrics file
  const metricsPath = path.join(path.dirname(combinedLcovPath), 'combined-coverage.txt')
  const outText = `total=${total}\ncovered=${covered}\ncoverage=${pct}%\n`
  fs.writeFileSync(metricsPath, outText, 'utf8')
  console.log('Combined coverage metrics:\n', outText)
  console.log('Combined lcov written to', combinedLcovPath)
}

main()
