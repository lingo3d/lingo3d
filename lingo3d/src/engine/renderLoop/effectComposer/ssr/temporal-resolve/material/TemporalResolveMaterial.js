import { Vector2 } from "three"
import { Uniform } from "three"
import { ShaderMaterial } from "three"
import vertexShader from "../shader/basicVertexShader.js"
import temporalResolve from "../shader/temporalResolve.js"

export class TemporalResolveMaterial extends ShaderMaterial {
	constructor(customComposeShader) {
		const fragmentShader = temporalResolve.replace("#include <custom_compose_shader>", customComposeShader)

		super({
			type: "TemporalResolveMaterial",
			uniforms: {
				inputTexture: new Uniform(null),
				accumulatedTexture: new Uniform(null),
				velocityTexture: new Uniform(null),
				lastVelocityTexture: new Uniform(null),
				samples: new Uniform(1),
				blend: new Uniform(0.5),
				correction: new Uniform(1),
				exponent: new Uniform(1),
				invTexSize: new Uniform(new Vector2())
			},
			defines: {
				correctionRadius: 1
			},
			vertexShader,
			fragmentShader
		})
	}
}
