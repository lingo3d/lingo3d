import { WebContainer } from "@webcontainer/api"
import { Terminal } from "xterm"

export async function installDependencies(
    terminal: Terminal,
    webcontainerInstance: WebContainer
) {
    // Install dependencies
    const installProcess = await webcontainerInstance.spawn("npm", ["install"])
    installProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data)
            }
        })
    )
    // Wait for install command to exit
    return installProcess.exit
}

export async function startDevServer(
    terminal: Terminal,
    webcontainerInstance: WebContainer
) {
    // Run `npm run start` to start the Express app
    const serverProcess = await webcontainerInstance.spawn("npm", [
        "run",
        "start"
    ])
    serverProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal.write(data)
            }
        })
    )

    // Wait for `server-ready` event
    webcontainerInstance.on("server-ready", (port, url) => {
        console.log({ port, url })
        // iframeEl.src = url
    })
}

// const exitCode = await installDependencies(
//     terminal,
//     webcontainerInstance
// )
// if (exitCode !== 0) throw new Error("Installation failed")
// startDevServer(terminal, webcontainerInstance)
