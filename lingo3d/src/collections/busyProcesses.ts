type Processes =
    | "loadModel"
    | "loadAudio"
    | "loadFBX"
    | "loadGLTF"
    | "loadJSON"
    | "loadSVG"
    | "loadTexture"
    | "runtime"
    | "physx"
    | "physxInstantiateAsync"
    | "importPhysX"
    | "configLoadedSrcSystem"

export const busyProcesses = new Map<Processes, number>()

export const addBusyProcess = (process: Processes) =>
    busyProcesses.set(process, (busyProcesses.get(process) ?? 0) + 1)

export const deleteBusyProcess = (process: Processes) => {
    const count = busyProcesses.get(process) ?? 0
    if (count > 1) busyProcesses.set(process, count - 1)
    else busyProcesses.delete(process)
}
