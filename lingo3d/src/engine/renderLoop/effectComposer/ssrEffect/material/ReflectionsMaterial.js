import { Matrix4, ShaderMaterial, Uniform } from "three"
import vertexShader from "./shader/basicVertexShader.js"
import helperFunctions from "./shader/helperFunctions.js"
import fragmentShader from "./shader/reflectionsShader.js"

export class ReflectionsMaterial extends ShaderMaterial {
    constructor() {
        super({
            type: "ReflectionsMaterial",

            uniforms: {
                inputTexture: new Uniform(null),
                accumulatedTexture: new Uniform(null),
                normalTexture: new Uniform(null),
                depthTexture: new Uniform(null),
                _projectionMatrix: new Uniform(new Matrix4()),
                _inverseProjectionMatrix: new Uniform(new Matrix4()),
                cameraMatrixWorld: new Uniform(new Matrix4()),
                cameraNear: new Uniform(0),
                cameraFar: new Uniform(0),
                rayDistance: new Uniform(0),
                intensity: new Uniform(0),
                roughnessFade: new Uniform(0),
                fade: new Uniform(0),
                thickness: new Uniform(0),
                ior: new Uniform(0),
                maxDepthDifference: new Uniform(0),
                jitter: new Uniform(0),
                jitterRoughness: new Uniform(0),
                maxRoughness: new Uniform(0),
                samples: new Uniform(0),
                viewMatrix: new Uniform(new Matrix4())
            },

            defines: {
                steps: 20,
                refineSteps: 5,
                vWorldPosition: "worldPos"
            },

            fragmentShader: fragmentShader.replace(
                "#include <helperFunctions>",
                helperFunctions
            ),
            vertexShader,

            toneMapped: false,
            depthWrite: false,
            depthTest: false
        })
    }
}
