import { createEffect } from "@lincode/reactivity"
import { ShaderMaterial } from "three"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { getSelectiveBloomComposer } from "../../../../states/useSelectiveBloomComposer"
import bloomPass from "../bloomPass"
import renderPass from "../renderPass"

createEffect(() => {
    const selectiveBloomComposer = getSelectiveBloomComposer()
    if (!selectiveBloomComposer) return

    selectiveBloomComposer.addPass(renderPass)
    selectiveBloomComposer.addPass(bloomPass)

    return () => {
        selectiveBloomComposer.removePass(renderPass)
        selectiveBloomComposer.removePass(bloomPass)
    }
}, [getSelectiveBloomComposer])

const selectiveBloomPass = new ShaderPass(
    new ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: null }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;
            varying vec2 vUv;
            void main() {
                gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
            }
        `,
        defines: {}
    }),
    "baseTexture"
)

const { uniforms } = selectiveBloomPass
getSelectiveBloomComposer(composer => composer && (uniforms["bloomTexture"].value = composer.renderTarget2.texture))

export default selectiveBloomPass