export const assetsPathPtr = [""]
export const dummyUrlPtr = [""]
export const ybotUrlPtr = [""]
export const texturesUrlPtr = [""]
export const waternormalsUrlPtr = [""]
export const editorUrlPtr = [""]
export const wasmUrlPtr = [""]

export const facadeUrlPtr = ["https://unpkg.com/lingo3d-facade@1.0.0/assets/"]
export const forestUrlPtr = ["https://unpkg.com/lingo3d-forest@1.0.0/assets/"]

export const setAssetsPath = (val: string) => {
    assetsPathPtr[0] = val.at(-1) === "/" ? val : val + "/"
    dummyUrlPtr[0] = assetsPathPtr[0] + "dummy/"
    ybotUrlPtr[0] = dummyUrlPtr[0] + "ybot.fbx"
    texturesUrlPtr[0] = assetsPathPtr[0] + "textures/"
    waternormalsUrlPtr[0] = texturesUrlPtr[0] + "waternormals.jpg"
    editorUrlPtr[0] = assetsPathPtr[0] + "editor/"
    wasmUrlPtr[0] = assetsPathPtr[0] + "wasm/"
}

setAssetsPath("assets")

// setAssetsPath(
//     "http://ec2-69-230-242-89.cn-northwest-1.compute.amazonaws.com.cn:8080/"
// )
