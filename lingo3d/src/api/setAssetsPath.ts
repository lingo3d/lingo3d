import {
    assetsPathPtr,
    dummyUrlPtr,
    ybotUrlPtr,
    texturesUrlPtr,
    editorUrlPtr,
    wasmUrlPtr
} from "../pointers/assetsPathPointers"

export const setAssetsPath = (val: string) => {
    assetsPathPtr[0] = val.at(-1) === "/" ? val : val + "/"
    dummyUrlPtr[0] = assetsPathPtr[0] + "dummy/"
    ybotUrlPtr[0] = dummyUrlPtr[0] + "ybot.fbx"
    texturesUrlPtr[0] = assetsPathPtr[0] + "textures/"
    editorUrlPtr[0] = assetsPathPtr[0] + "editor/"
    wasmUrlPtr[0] = assetsPathPtr[0] + "wasm/"
}

setAssetsPath("assets")

// setAssetsPath(
//     "http://ec2-69-230-242-89.cn-northwest-1.compute.amazonaws.com.cn:8080/"
// )
