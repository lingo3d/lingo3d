const getFiles = async (
    dirHandle,
    recursive,
    path = dirHandle.name,
    skipDirectory
) => {
    const dirs = []
    const files = []
    for await (const entry of dirHandle.values()) {
        const nestedPath = `${path}/${entry.name}`
        if (entry.kind === "file") {
            files.push(
                entry.getFile().then((file) => {
                    file.directoryHandle = dirHandle
                    file.handle = entry
                    return Object.defineProperty(file, "webkitRelativePath", {
                        configurable: true,
                        enumerable: true,
                        get: () => nestedPath
                    })
                })
            )
        } else if (
            entry.kind === "directory" &&
            recursive &&
            (!skipDirectory || !skipDirectory(entry, nestedPath))
        ) {
            dirs.push(getFiles(entry, recursive, nestedPath, skipDirectory))
        }
    }
    return [...(await Promise.all(dirs)).flat(), ...(await Promise.all(files))]
}

export default async (options = {}) => {
    options.recursive = options.recursive || false
    options.mode = options.mode || "read"
    const handle = await window.showDirectoryPicker({
        id: options.id,
        startIn: options.startIn,
        mode: options.mode
    })
    if ((await (await handle.values()).next()).done) return [handle, []]
    return [
        handle,
        await getFiles(
            handle,
            options.recursive,
            undefined,
            options.skipDirectory
        )
    ]
}
