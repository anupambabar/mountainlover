const fs = require('node:fs')
const path = require('node:path')

function readCoverage(metricsPath) {
  if (!fs.existsSync(metricsPath)) throw new Error('coverage metrics not found: ' + metricsPath)
  const content = fs.readFileSync(metricsPath, 'utf8')
  const m = content.match(/coverage=(\d+)%/)
  if (!m) throw new Error('coverage percentage not found in metrics')
  return Number.parseInt(m[1], 10)
}

function updateReadme(readmePath, pct) {
  const badgeRegex = /!\[coverage\]\(https:\/\/img\.shields\.io\/badge\/coverage-\d+%25-[^)]*\)/
  let readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : ''
  const newBadge = `![coverage](https://img.shields.io/badge/coverage-${pct}%25-yellow)`
  if (badgeRegex.test(readme)) {
    readme = readme.replace(badgeRegex, newBadge)
  } else {
    // prepend badge if not found
    readme = `${newBadge}\n\n${readme}`
  }
  fs.writeFileSync(readmePath, readme, 'utf8')
}

function main() {
  const metrics = process.argv[2] || 'coverage/combined-coverage.txt'
  const readme = process.argv[3] || 'README.md'
  const pct = readCoverage(metrics)
  updateReadme(readme, pct)
  console.log('Updated README badge to', pct + '%')
}

main()
