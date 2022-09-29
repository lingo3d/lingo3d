/* eslint-disable camelcase */
import { ShaderChunk } from "three"

// source: https://stackoverflow.com/a/6969486/7626841
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

// credits for the box-projecting shader code go to codercat (https://codercat.tk)

const worldposReplace = /* glsl */ `
#if defined( USE_ENVMAP ) || defined(  ) || defined ( USE_SHADOWMAP )
    vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

    #ifdef BOX_PROJECTED_ENV_MAP
        vWorldPosition = worldPosition.xyz;
    #endif
#endif
`

const boxProjectDefinitions = /* glsl */ `
#ifdef BOX_PROJECTED_ENV_MAP
    uniform vec3 envMapSize;
    uniform vec3 envMapPosition;
    varying vec3 vWorldPosition;
    
    vec3 parallaxCorrectNormal( vec3 v, vec3 cubeSize, vec3 cubePos ) {
        vec3 nDir = normalize( v );

        vec3 rbmax = ( .5 * cubeSize + cubePos - vWorldPosition ) / nDir;
        vec3 rbmin = ( -.5 * cubeSize + cubePos - vWorldPosition ) / nDir;

        vec3 rbminmax;

        rbminmax.x = ( nDir.x > 0. ) ? rbmax.x : rbmin.x;
        rbminmax.y = ( nDir.y > 0. ) ? rbmax.y : rbmin.y;
        rbminmax.z = ( nDir.z > 0. ) ? rbmax.z : rbmin.z;

        float correction = min( min( rbminmax.x, rbminmax.y ), rbminmax.z );
        vec3 boxIntersection = vWorldPosition + nDir * correction;
        
        return boxIntersection - cubePos;
    }
#endif
`

// will be inserted after "vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );"
const getIBLIrradiance_patch = /* glsl */ `
#ifdef BOX_PROJECTED_ENV_MAP
    worldNormal = parallaxCorrectNormal( worldNormal, envMapSize, envMapPosition );
#endif
`

// will be inserted after "reflectVec = inverseTransformDirection( reflectVec, viewMatrix );"
const getIBLRadiance_patch = /* glsl */ `
#ifdef BOX_PROJECTED_ENV_MAP
    reflectVec = parallaxCorrectNormal( reflectVec, envMapSize, envMapPosition );
#endif
`

export function useBoxProjectedEnvMap(shader, envMapPosition, envMapSize) {
	// defines
	shader.defines.BOX_PROJECTED_ENV_MAP = ""

	// uniforms
	shader.uniforms.envMapPosition = {
		value: envMapPosition
	}

	shader.uniforms.envMapSize = {
		value: envMapSize
	}

	const line1 = new RegExp(
		escapeRegExp("vec3 worldNormal = inverseTransformDirection ( normal , viewMatrix ) ;").replaceAll(" ", "\\s*"),
		"g"
	)
	const line2 = new RegExp(
		escapeRegExp("reflectVec = inverseTransformDirection ( reflectVec , viewMatrix ) ;").replaceAll(" ", "\\s*"),
		"g"
	)

	// vertex shader
	shader.vertexShader =
		"varying vec3 vWorldPosition;\n" + shader.vertexShader.replace("#include <worldpos_vertex>", worldposReplace)

	// fragment shader
	shader.fragmentShader =
		boxProjectDefinitions +
		"\n" +
		shader.fragmentShader
			.replace("#include <envmap_physical_pars_fragment>", ShaderChunk.envmap_physical_pars_fragment)
			.replace(
				line1,
				`vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
                ${getIBLIrradiance_patch}`
			)
			.replace(
				line2,
				`reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
                ${getIBLRadiance_patch}`
			)
}
