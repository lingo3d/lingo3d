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

type Options = {
    clipBias?: number
    textureWidth?: number
    textureHeight?: number
    color?: ColorRepresentation
    shader?: any
    multisample?: number
}

export default class ReflectorMaterial extends ShaderMaterial {
    private camera = new PerspectiveCamera()
    private renderTarget: WebGLRenderTarget

    public render: (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) => void

    constructor(mesh: Mesh, options: Options = {}) {
        const shader = options.shader || ReflectorMaterial.ReflectorShader


        super({
            uniforms: UniformsUtils.clone(shader.uniforms),
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader
        })
        
        const scope = this

        const color =
            options.color !== undefined
                ? new Color(options.color)
                : new Color(0x7f7f7f)
        const textureWidth = options.textureWidth || 512
        const textureHeight = options.textureHeight || 512
        const clipBias = options.clipBias || 0
        const multisample =
            options.multisample !== undefined ? options.multisample : 4

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

        const renderTarget = this.renderTarget = new WebGLRenderTarget(
            textureWidth,
            textureHeight,
            { samples: multisample }
        )

        this.uniforms["tDiffuse"].value = renderTarget.texture
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

            renderTarget.texture.encoding = renderer.outputEncoding

            scope.visible = false

            const currentRenderTarget = renderer.getRenderTarget()

            const currentXrEnabled = renderer.xr.enabled
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate

            renderer.xr.enabled = false // Avoid camera modification
            renderer.shadowMap.autoUpdate = false // Avoid re-computing shadows

            renderer.setRenderTarget(renderTarget)

            renderer.state.buffers.depth.setMask(true) // make sure the depth buffer is writable so it can be properly cleared, see #18897

            if (renderer.autoClear === false) renderer.clear()
            renderer.render(scene, virtualCamera)

            renderer.xr.enabled = currentXrEnabled
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate

            renderer.setRenderTarget(currentRenderTarget)

            // Restore viewport

            //@ts-ignore
            const viewport = camera.viewport

            if (viewport !== undefined) {
                renderer.state.viewport(viewport)
            }

            scope.visible = true
        }
    }

    public override dispose() {
        super.dispose()
        this.renderTarget.dispose()
    }

    public static ReflectorShader = {
        uniforms: {
            color: {
                value: null
            },

            tDiffuse: {
                value: null
            },

            textureMatrix: {
                value: null
            },

            opacity: {
                value: 1.0
            }
        },

        vertexShader: /* glsl */ `
            uniform mat4 textureMatrix;
            varying vec4 vUv;
    
            #include <common>
            #include <logdepthbuf_pars_vertex>
    
            void main() {
    
                vUv = textureMatrix * vec4( position, 1.0 );
    
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
                #include <logdepthbuf_vertex>
    
            }`,

        fragmentShader: /* glsl */ `
            uniform vec3 color;
            uniform sampler2D tDiffuse;
            uniform float opacity;
            varying vec4 vUv;
    
            #include <logdepthbuf_pars_fragment>
    
            float blendOverlay( float base, float blend ) {
    
                return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
    
            }
    
            vec3 blendOverlay( vec3 base, vec3 blend ) {
                float r = blendOverlay( base.r, blend.r );
                float g = blendOverlay( base.g, blend.g );
                float b = blendOverlay( base.b, blend.b );

                return vec3( r, g, b );
    
            }
    
            void main() {
    
                #include <logdepthbuf_fragment>
    
                vec4 base = texture2DProj( tDiffuse, vUv );
                gl_FragColor = vec4( blendOverlay( base.rgb, color ), opacity );
    
                #include <encodings_fragment>
    
            }`
    }
}