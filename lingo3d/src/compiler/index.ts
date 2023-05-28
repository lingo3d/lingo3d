import * as esbuild from "esbuild-wasm"
import { wasmUrlPtr } from "../pointers/assetsPathPointers"
;(async () => {
    await esbuild.initialize({
        wasmURL: wasmUrlPtr[0] + "esbuild.wasm"
    })

    const code = `
        import "lingo3d-runtime"
        console.log("hello world")
    `

    let result1 = await esbuild.transform(code, {  })
    let result2 = esbuild.build({  })
    
    console.log(result1, result2)
})()
