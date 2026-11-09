import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'

test('initializes missing config and never overwrites existing credentials', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'weather-config-'))
  try {
    const scripts = path.join(root, 'scripts')
    const keys = path.join(root, 'src/resources/services/keys')
    fs.mkdirSync(scripts, { recursive: true })
    fs.mkdirSync(keys, { recursive: true })
    const script = path.join(scripts, 'ensure-config.cjs')
    fs.copyFileSync(path.resolve('scripts/ensure-config.cjs'), script)
    fs.writeFileSync(path.join(keys, 'config.example.js'), 'export default { apiKey: "" }')
    execFileSync(process.execPath, [script])
    expect(fs.readFileSync(path.join(keys, 'config.js'), 'utf8')).toBe('export default { apiKey: "" }')
    const existing = 'export default { apiKey: "fixture-existing-key" }'
    fs.writeFileSync(path.join(keys, 'config.js'), existing)
    execFileSync(process.execPath, [script])
    expect(fs.readFileSync(path.join(keys, 'config.js'), 'utf8')).toBe(existing)
  } finally { fs.rmSync(root, { recursive: true, force: true }) }
})
