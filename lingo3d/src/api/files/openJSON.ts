import loadFile from "./loadFile"

export default async () => {
    const { fileOpen } = await import("browser-fs-access")
    return loadFile(await fileOpen({ extensions: [".json"], id: "lingo3d" }))
}
