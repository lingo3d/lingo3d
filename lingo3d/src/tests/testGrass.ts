import {
    Clock,
    DoubleSide,
    InstancedMesh,
    Mesh,
    Object3D,
    PlaneGeometry,
    ShaderMaterial,
} from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler"
import Cube from "../display/primitives/Cube"
import { vector3, vector3_ } from "../display/utils/reusables"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"

const leavesMaterial = new ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        uniform float time;
        
        // 噪波
        float N (vec2 st) {
            return fract( sin( dot( st.xy, vec2(12.9898,78.233 ) ) ) *  43758.5453123);
        }
        
        float smoothNoise( vec2 ip ){
            vec2 lv = fract( ip );
            vec2 id = floor( ip );
            
            lv = lv * lv * ( 3. - 2. * lv );
            
            float bl = N( id );
            float br = N( id + vec2( 1, 0 ));
            float b = mix( bl, br, lv.x );
            
            float tl = N( id + vec2( 0, 1 ));
            float tr = N( id + vec2( 1, 1 ));
            float t = mix( tl, tr, lv.x );
            
            return mix( b, t, lv.y );
        }
        
        void main() {
        
            vUv = uv;
            float t = time * 2.;
            
            // 顶点位置
            
            vec4 mvPosition = vec4( position, 1.0 );
            #ifdef USE_INSTANCING
                mvPosition = instanceMatrix * mvPosition;
            #endif
            
            // 移动
            
            float noise = smoothNoise(mvPosition.xz * 0.5 + vec2(0., t));
            noise = pow(noise * 0.5 + 0.5, 2.) * 2.;
            
            // 叶片顶部晃动力度.
            float dispPower = 1. - cos( uv.y * 3.1416 * 0.5 );
            
            float displacement = noise * ( 0.3 * dispPower );
            mvPosition.z -= displacement;
            
            //
            
            vec4 modelViewPosition = modelViewMatrix * mvPosition;
            gl_Position = projectionMatrix * modelViewPosition;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        void main() {
            vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
            float clarity = ( vUv.y * 0.5 ) + 0.5;
            gl_FragColor = vec4( baseColor * clarity, 1 );
        }
    `,
    uniforms: {
        time: {
            value: 0
        }
    },
    side: DoubleSide
})

const cube = new Cube()
cube.width = 1000
cube.depth = 1000
cube.height = 10

const sampler = new MeshSurfaceSampler(cube.nativeObject3d as Mesh).build()

const instanceNumber = 100
const dummy = new Object3D()
const geometry = new PlaneGeometry(0.1, 1, 1, 4)
geometry.translate(0, 0.5, 0) // 吧草叶的最低点设置到0.
const instancedMesh = new InstancedMesh(
    geometry,
    leavesMaterial,
    instanceNumber
)
scene.add(instancedMesh)
const _position = vector3
const _normal = vector3_
for (let i = 0; i < instanceNumber; i++) {
    sampler.sample(_position, _normal)
    _normal.add(_position)
    dummy.position.set(_position.x, 0, _position.z)
    dummy.scale.setScalar(0.5 + Math.random() * 0.5)
    dummy.rotation.y = Math.random() * Math.PI
    dummy.updateMatrix()
    instancedMesh.setMatrixAt(i, dummy.matrix)
}

export const clock = new Clock()

onBeforeRender(() => {
    leavesMaterial.uniforms.time.value = clock.getElapsedTime()
    leavesMaterial.uniformsNeedUpdate = true
})
