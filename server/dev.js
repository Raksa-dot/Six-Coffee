import { spawn } from "node:child_process"

function run(name, command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} berhenti dengan kode ${code}`)
      process.exit(code)
    }
  })

  return child
}

const server = run("server", "node", ["server/server.js"])
const vite = run("vite", "npm", ["run", "dev"])

function stop() {
  server.kill()
  vite.kill()
  process.exit()
}

process.on("SIGINT", stop)
process.on("SIGTERM", stop)
