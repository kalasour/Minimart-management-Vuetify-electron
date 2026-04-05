#!/usr/bin/env node
/**
 * Run after: npm install --ignore-scripts
 * On Apple Silicon, old Electron / chromedriver need x64 artifacts; Firebase's grpc native
 * addon does not support darwin-arm64 for this stack, so skip full lifecycle scripts.
 */
const { execFileSync } = require('child_process')
const path = require('path')

const root = path.join(__dirname, '..')
const env = { ...process.env }
if (process.platform === 'darwin' && process.arch === 'arm64') {
  env.npm_config_arch = 'x64'
  env.npm_config_platform = 'darwin'
}

const node = process.execPath

function run(scriptRel) {
  execFileSync(node, [path.join(root, scriptRel)], { stdio: 'inherit', env, cwd: root })
}

run('node_modules/electron/install.js')
run('node_modules/electron-chromedriver/download-chromedriver.js')
