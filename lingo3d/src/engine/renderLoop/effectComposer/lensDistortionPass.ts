import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { ShaderMaterial } from "three"
import { getLensIor } from "../../../states/useLensIor"
import { getLensBand } from "../../../states/useLensBand"

const lensDistortionPass = new ShaderPass(new ShaderMaterial({

	defines: {

		// 0: NONE, 1: RGB, 2: RYGCBV
		BAND_MODE: 2,

		CHROMA_SAMPLES: 1,

	},

	uniforms: {

		tDiffuse: { value: null },
		baseIor: { value: 0.8 },
		bandOffset: { value: 0.01 },
		jitterIntensity: { value: 1.0 },
		jitterOffset: { value: 0.0 },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;
		varying vec3 viewDir;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			viewDir = normalize( ( modelViewMatrix * vec4( position, 1.0 ) ).xyz );

		}

	`,

	fragmentShader: /* glsl */`

		varying vec2 vUv;
		varying vec3 viewDir;
		uniform float baseIor;
		uniform float bandOffset;
		uniform float jitterIntensity;
		uniform float jitterOffset;
		uniform sampler2D tDiffuse;

		#include <common>
		void main() {

			vec3 normal = vec3( ( 2.0 * vUv - vec2( 1.0 ) ), 1.0 );
			normal.z = 1.0;
			normal = normalize( normal );

			vec3 color;

			// if NO BANDS
			#if BAND_MODE == 0

			vec3 refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor );
			color = texture2D( tDiffuse, vUv + refracted.xy ).rgb;

			// if RGB or RYGCBV BANDS
			#else

			float index, randValue, offsetValue;
			float r, g, b, r_ior, g_ior, b_ior;
			vec3 r_refracted, g_refracted, b_refracted;
			vec4 r_sample, g_sample, b_sample;

			#if BAND_MODE == 2
			float y, c, v, y_ior, c_ior, v_ior;
			vec3 y_refracted, c_refracted, v_refracted;
			vec4 y_sample, c_sample, v_sample;
			#endif

			for ( int i = 0; i < CHROMA_SAMPLES; i ++ ) {

				index = float( i );
				randValue = rand( sin( index + 1. ) * gl_FragCoord.xy + vec2( jitterOffset, - jitterOffset ) ) - 0.5;
				offsetValue = index / float( CHROMA_SAMPLES ) + randValue * jitterIntensity;
				#if BAND_MODE == 1
				randValue *= 2.0;
				#endif

				// Paper describing functions for creating yellow, cyan, and violet bands and reforming
				// them into RGB:
				// https://web.archive.org/web/20061108181225/http://home.iitk.ac.in/~shankars/reports/dispersionraytrace.pdf
				r_ior = 1.0 + bandOffset * ( 0.0 + offsetValue );
				g_ior = 1.0 + bandOffset * ( 2.0 + offsetValue );
				b_ior = 1.0 + bandOffset * ( 4.0 + offsetValue );

				r_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / r_ior );
				g_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / g_ior );
				b_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / b_ior );

				r_sample = texture2D( tDiffuse, vUv + r_refracted.xy );
				g_sample = texture2D( tDiffuse, vUv + g_refracted.xy );
				b_sample = texture2D( tDiffuse, vUv + b_refracted.xy );

				#if BAND_MODE == 2
				y_ior = 1.0 + bandOffset * ( 1.0 + offsetValue );
				c_ior = 1.0 + bandOffset * ( 3.0 + offsetValue );
				v_ior = 1.0 + bandOffset * ( 5.0 + offsetValue );

				y_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / y_ior );
				c_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / c_ior );
				v_refracted = refract( vec3( 0.0, 0.0, - 1.0 ), normal, baseIor / v_ior );

				y_sample = texture2D( tDiffuse, vUv + y_refracted.xy );
				c_sample = texture2D( tDiffuse, vUv + c_refracted.xy );
				v_sample = texture2D( tDiffuse, vUv + v_refracted.xy );

				r = r_sample.r / 2.0;
				y = ( 2.0 * y_sample.r + 2.0 * y_sample.g - y_sample.b ) / 6.0;
				g = g_sample.g / 2.0;
				c = ( 2.0 * c_sample.g + 2.0 * c_sample.b - c_sample.r ) / 6.0;
				b = b_sample.b / 2.0;
				v = ( 2.0 * v_sample.b + 2.0 * v_sample.r - v_sample.g ) / 6.0;

				color.r += r + ( 2.0 * v + 2.0 * y - c ) / 3.0;
				color.g += g + ( 2.0 * y + 2.0 * c - v ) / 3.0;
				color.b += b + ( 2.0 * c + 2.0 * v - y ) / 3.0;
				#else
				color.r += r_sample.r;
				color.g += g_sample.g;
				color.b += b_sample.b;
				#endif

			}

			color /= float( CHROMA_SAMPLES );

			#endif

			gl_FragColor = vec4( color, 1.0 );

		}

	`
}))
const { uniforms } = lensDistortionPass
getLensIor(val => uniforms["baseIor"].value = val)
getLensBand(val => uniforms["bandOffset"].value = val)

export default lensDistortionPass