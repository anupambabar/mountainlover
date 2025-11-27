const fs = require('fs')
const path = require('path')

const checklistPath = path.resolve(__dirname, '..', 'docs', 'production-readiness-checklist.md')

function parseSafeBuildTable(doc) {
  const anchor = '## Safe Build Gate'
  const startIndex = doc.indexOf(anchor)
  if (startIndex === -1) {
    throw new Error('Safe Build Gate section not found in production-readiness-checklist.md')
  }

  const section = doc.slice(startIndex).split('\n')
  const tableLines = []

  for (let i = 0; i < section.length; i += 1) {
    const line = section[i]
    if (!line.trim()) {
      if (tableLines.length) break
      continue
    }
    if (!line.trim().startsWith('|')) {
      if (tableLines.length) break
      continue
    }
    tableLines.push(line)
  }

  if (tableLines.length < 3) {
    throw new Error('Safe Build Gate table is incomplete; expected header and data rows.')
  }

  const rows = tableLines.slice(2).map((line) => {
    const cols = line.split('|').map((c) => c.trim())
    // split adds empty string at start/end because lines begin/end with |
    const filtered = cols.filter((c) => c.length > 0)
    return {
      control: filtered[0] || 'Unknown Control',
      status: filtered[1] || 'Missing',
      evidence: filtered[2] || '',
    }
  })

  return rows
}

function main() {
  const doc = fs.readFileSync(checklistPath, 'utf8')
  const rows = parseSafeBuildTable(doc)
  const outstanding = rows.filter((row) => row.status.toLowerCase() !== 'done')

  if (outstanding.length > 0) {
    console.error('Safe Build Gate failed. Resolve the following controls before building:')
    outstanding.forEach((row) => {
      console.error(`- ${row.control}: status "${row.status}" ${row.evidence ? `→ ${row.evidence}` : ''}`)
    })
    process.exit(1)
  }

  console.log('Safe Build Gate passed. All mandatory controls are marked Done.')
}

try {
  main()
} catch (err) {
  console.error(`Safe Build Gate error: ${err.message}`)
  process.exit(1)
}


