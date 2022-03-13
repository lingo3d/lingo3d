import { ShaderMaterial } from "three"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import selectiveBloomComposer from "./selectiveBloomComposer"

const selectiveBloomPass = new ShaderPass(
    new ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: selectiveBloomComposer.renderTarget2.texture }
        },
        vertexShader:
`varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
        fragmentShader:
`uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
    gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
}`,
        defines: {}
    }),
    "baseTexture"
)
// After performing post-processing, you can choose whether or not to replace the before and drawing result drawing
// selectiveBloomPass.needsSwap = true

export default selectiveBloomPass