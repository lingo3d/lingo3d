// this shader is from: https://github.com/gkjohnson/threejs-sandbox
/* eslint-disable camelcase */

import { Matrix4, ShaderChunk, ShaderMaterial } from "three"

// Returns the body of the vertex shader for the velocity buffer and
// outputs the position of the current and last frame positions
const velocity_vertex = /* glsl */ `
		vec3 transformed;

		// Get the normal
		${ShaderChunk.beginnormal_vertex}
		${ShaderChunk.defaultnormal_vertex}

		// Get the current vertex position
		transformed = vec3( position );
		newPosition = velocityMatrix * vec4( transformed, 1.0 );

		// Get the previous vertex position
		transformed = vec3( position );
		prevPosition = prevVelocityMatrix * vec4( transformed, 1.0 );

		gl_Position = newPosition;
`

export class VelocityMaterial extends ShaderMaterial {
	constructor() {
		super({
			uniforms: {
				prevVelocityMatrix: { value: new Matrix4() },
				velocityMatrix: { value: new Matrix4() },
				prevBoneTexture: { value: null },
				interpolateGeometry: { value: 0 },
				intensity: { value: 1 },
				boneTexture: { value: null },

				alphaTest: { value: 0.0 },
				map: { value: null },
				alphaMap: { value: null },
				opacity: { value: 1.0 }
			},

			vertexShader: /* glsl */ `
                    #define MAX_BONES 1024
                    
                    uniform mat4 velocityMatrix;
                    uniform mat4 prevVelocityMatrix;
                    uniform float interpolateGeometry;
                    varying vec4 prevPosition;
                    varying vec4 newPosition;
					varying vec2 vHighPrecisionZW;
        
                    void main() {
        
                        ${velocity_vertex}

						vHighPrecisionZW = gl_Position.zw;
        
                    }`,
			fragmentShader: /* glsl */ `
                    uniform float intensity;
                    varying vec4 prevPosition;
                    varying vec4 newPosition;
					varying vec2 vHighPrecisionZW;
        
                    void main() {
						#ifdef FULL_MOVEMENT
						gl_FragColor = vec4( 1., 1., 1. - gl_FragCoord.z, 0. );
						return;
						#endif

                        vec2 pos0 = (prevPosition.xy / prevPosition.w) * 0.5 + 0.5;
                        vec2 pos1 = (newPosition.xy / newPosition.w) * 0.5 + 0.5;
        
                        vec2 vel = pos1 - pos0;

						float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
                        
                        gl_FragColor = vec4( vel, 1. - fragCoordZ, 0. );
        
                    }`
		})

		this.isVelocityMaterial = true
	}
}
