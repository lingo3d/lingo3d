import {
    Color,
    ColorRepresentation,
    Matrix4,
    Mesh,
    PerspectiveCamera,
    Plane,
    Scene,
    ShaderMaterial,
    UniformsUtils,
    Vector3,
    Vector4,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"
import createPass from "./createPass"
import reflectorShader from "./reflectorShader"
import renderScene from "./renderScene"

type Options = {
    clipBias?: number
    textureWidth?: number
    textureHeight?: number
    color?: ColorRepresentation
    shader?: any
}

export default class ReflectorMaterial extends ShaderMaterial {
    private camera = new PerspectiveCamera()
    public renderTarget: WebGLRenderTarget

    public render: (
        renderer: WebGLRenderer,
        scene: Scene,
        camera: PerspectiveCamera
    ) => void

    public constructor(mesh: Mesh, options: Options = {}) {
        super({
            uniforms: UniformsUtils.clone(reflectorShader.uniforms),
            fragmentShader: reflectorShader.fragmentShader,
            vertexShader: reflectorShader.vertexShader
        })

        const color =
            options.color !== undefined
                ? new Color(options.color)
                : new Color(0x7f7f7f)
        const textureWidth = options.textureWidth || 512
        const textureHeight = options.textureHeight || 512
        const clipBias = options.clipBias || 0
        //

        const reflectorPlane = new Plane()
        const normal = new Vector3()
        const reflectorWorldPosition = new Vector3()
        const cameraWorldPosition = new Vector3()
        const rotationMatrix = new Matrix4()
        const lookAtPosition = new Vector3(0, 0, -1)
        const clipPlane = new Vector4()

        const view = new Vector3()
        const target = new Vector3()
        const q = new Vector4()

        const textureMatrix = new Matrix4()
        const virtualCamera = this.camera

        const { renderTarget } = createPass(textureWidth, textureHeight, reflectorShader, this)
        this.renderTarget = renderTarget

        this.uniforms["color"].value = color
        this.uniforms["textureMatrix"].value = textureMatrix
        this.transparent = true

        this.render = (renderer, scene, camera) => {
            reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld)
            cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld)

            rotationMatrix.extractRotation(mesh.matrixWorld)

            normal.set(0, 0, 1)
            normal.applyMatrix4(rotationMatrix)

            view.subVectors(reflectorWorldPosition, cameraWorldPosition)

            // Avoid rendering when reflector is facing away

            if (view.dot(normal) > 0) return

            view.reflect(normal).negate()
            view.add(reflectorWorldPosition)

            rotationMatrix.extractRotation(camera.matrixWorld)

            lookAtPosition.set(0, 0, -1)
            lookAtPosition.applyMatrix4(rotationMatrix)
            lookAtPosition.add(cameraWorldPosition)

            target.subVectors(reflectorWorldPosition, lookAtPosition)
            target.reflect(normal).negate()
            target.add(reflectorWorldPosition)

            virtualCamera.position.copy(view)
            virtualCamera.up.set(0, 1, 0)
            virtualCamera.up.applyMatrix4(rotationMatrix)
            virtualCamera.up.reflect(normal)
            virtualCamera.lookAt(target)

            virtualCamera.far = camera.far // Used in WebGLBackground

            virtualCamera.updateMatrixWorld()
            virtualCamera.projectionMatrix.copy(camera.projectionMatrix)

            // Update the texture matrix
            textureMatrix.set(
                0.5,
                0.0,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.5,
                0.0,
                0.0,
                0.5,
                0.5,
                0.0,
                0.0,
                0.0,
                1.0
            )
            textureMatrix.multiply(virtualCamera.projectionMatrix)
            textureMatrix.multiply(virtualCamera.matrixWorldInverse)
            textureMatrix.multiply(mesh.matrixWorld)

            // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            reflectorPlane.setFromNormalAndCoplanarPoint(
                normal,
                reflectorWorldPosition
            )
            reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse)

            clipPlane.set(
                reflectorPlane.normal.x,
                reflectorPlane.normal.y,
                reflectorPlane.normal.z,
                reflectorPlane.constant
            )

            const projectionMatrix = virtualCamera.projectionMatrix

            q.x =
                (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
                projectionMatrix.elements[0]
            q.y =
                (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
                projectionMatrix.elements[5]
            q.z = -1.0
            q.w =
                (1.0 + projectionMatrix.elements[10]) /
                projectionMatrix.elements[14]

            // Calculate the scaled plane vector
            clipPlane.multiplyScalar(2.0 / clipPlane.dot(q))

            // Replacing the third row of the projection matrix
            projectionMatrix.elements[2] = clipPlane.x
            projectionMatrix.elements[6] = clipPlane.y
            projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias
            projectionMatrix.elements[14] = clipPlane.w

            // Render
            renderScene(renderer, renderTarget, scene, virtualCamera)

            // Restore viewport

            //@ts-ignore
            const viewport = camera.viewport

            if (viewport !== undefined) {
                renderer.state.viewport(viewport)
            }
        }
    }

    public override dispose() {
        super.dispose()
        this.renderTarget.dispose()
    }
}
