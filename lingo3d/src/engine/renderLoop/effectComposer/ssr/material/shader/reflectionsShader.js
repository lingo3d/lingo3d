export default `varying vec2 vUv;

uniform sampler2D inputTexture;
uniform sampler2D accumulatedTexture;
uniform sampler2D normalTexture;
uniform sampler2D depthTexture;
uniform sampler2D envMap;

uniform mat4 _projectionMatrix;
uniform mat4 _inverseProjectionMatrix;
uniform mat4 cameraMatrixWorld;
uniform float cameraNear;
uniform float cameraFar;

uniform float rayDistance;
uniform float intensity;
uniform float maxDepthDifference;
uniform float roughnessFade;
uniform float maxRoughness;
uniform float fade;
uniform float thickness;
uniform float ior;

uniform float samples;

uniform float jitter;
uniform float jitterRoughness;

#define INVALID_RAY_COORDS vec2(-1.0);
#define EARLY_OUT_COLOR    vec4(0.0, 0.0, 0.0, 1.0)
#define FLOAT_EPSILON      0.00001

float nearMinusFar;
float nearMulFar;
float farMinusNear;

#include <packing>

// helper functions
#include <helperFunctions>

vec2 RayMarch(vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference);
vec2 BinarySearch(in vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference);
float fastGetViewZ(const in float depth);
vec3 getIBLRadiance(const in vec3 viewDir, const in vec3 normal, const in float roughness);

void main() {
    vec4 depthTexel = textureLod(depthTexture, vUv, 0.0);

    // filter out sky
    if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) {
        gl_FragColor = EARLY_OUT_COLOR;
        return;
    }

    float unpackedDepth = unpackRGBAToDepth(depthTexel);

    vec4 normalTexel = textureLod(normalTexture, vUv, 0.0);
    float roughness = normalTexel.a;

    float specular = 1.0 - roughness;

    // pre-calculated variables for the "fastGetViewZ" function
    nearMinusFar = cameraNear - cameraFar;
    nearMulFar = cameraNear * cameraFar;
    farMinusNear = cameraFar - cameraNear;

    normalTexel.rgb = unpackRGBToNormal(normalTexel.rgb);

    // view-space depth
    float depth = fastGetViewZ(unpackedDepth);

    // view-space position of the current texel
    vec3 viewPos = getViewPosition(depth);
    vec3 viewDir = normalize(viewPos);
    vec3 viewNormal = normalTexel.xyz;

    // world-space position of the current texel
    vec3 worldPos = screenSpaceToWorldSpace(vUv, unpackedDepth);

    // jitteriing
    vec3 jitt = vec3(0.0);

    if (jitterRoughness != 0.0 || jitter != 0.0) {
        vec3 randomJitter = hash(50.0 * samples * worldPos) - 0.5;
        float spread = ((2.0 - specular) + roughness * jitterRoughness);
        float jitterMix = jitter * 0.25 + jitterRoughness * roughness;
        if (jitterMix > 1.0) jitterMix = 1.0;
        jitt = mix(vec3(0.0), randomJitter * spread, jitterMix);
    }

    viewNormal += jitt;

    float fresnelFactor = fresnel_dielectric(viewDir, viewNormal, ior);

    vec3 iblRadiance = getIBLRadiance(-viewDir, viewNormal, 0.) * fresnelFactor;

    float lastFrameAlpha = textureLod(accumulatedTexture, vUv, 0.0).a;

    if (roughness > maxRoughness || (roughness > 1.0 - FLOAT_EPSILON && roughnessFade > 1.0 - FLOAT_EPSILON)) {
        gl_FragColor = vec4(iblRadiance, lastFrameAlpha);
        return;
    }

    // view-space reflected ray
    vec3 reflected = reflect(viewDir, viewNormal);

    vec3 rayDir = reflected * -viewPos.z;

    vec3 hitPos = viewPos;
    float rayHitDepthDifference;

    vec2 coords = RayMarch(rayDir, hitPos, rayHitDepthDifference);

    if (coords.x == -1.0) {
        gl_FragColor = vec4(iblRadiance, lastFrameAlpha);
        return;
    }

    vec4 SSRTexel = textureLod(inputTexture, coords.xy, 0.0);
    vec4 SSRTexelReflected = textureLod(accumulatedTexture, coords.xy, 0.0);

    vec3 SSR = SSRTexel.rgb + SSRTexelReflected.rgb;

    float roughnessFactor = mix(specular, 1.0, max(0.0, 1.0 - roughnessFade));

    vec2 coordsNDC = (coords.xy * 2.0 - 1.0);
    float screenFade = 0.1;
    float maxDimension = min(1.0, max(abs(coordsNDC.x), abs(coordsNDC.y)));
    float reflectionIntensity = 1.0 - (max(0.0, maxDimension - screenFade) / (1.0 - screenFade));
    reflectionIntensity = max(0., reflectionIntensity);

    vec3 finalSSR = mix(iblRadiance, SSR, reflectionIntensity) * roughnessFactor;

    // vec2 dCoords = smoothstep(0.2, 0.6, abs(vec2(0.5, 0.5) - coords.xy));
    // float screenEdgefactor = clamp(1.0 - (dCoords.x + dCoords.y), 0.0, 1.0);
    // vec3 finalSSR = mix(iblRadiance, SSR * screenEdgefactor, screenEdgefactor) * roughnessFactor;

    if (fade != 0.0) {
        vec3 hitWorldPos = screenSpaceToWorldSpace(coords, rayHitDepthDifference);

        // distance from the reflection point to what it's reflecting
        float reflectionDistance = distance(hitWorldPos, worldPos) + 1.0;

        float opacity = 1.0 / (reflectionDistance * fade * 0.1);
        if (opacity > 1.0) opacity = 1.0;
        finalSSR *= opacity;
    }

    finalSSR *= fresnelFactor * intensity;
    finalSSR = min(vec3(1.0), finalSSR);

    float alpha = hitPos.z == 1.0 ? 1.0 : SSRTexelReflected.a;
    alpha = min(lastFrameAlpha, alpha);

    gl_FragColor = vec4(finalSSR, alpha);
}

vec2 RayMarch(vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference) {
    dir = normalize(dir);
    dir *= rayDistance / float(steps);

    float depth;
    vec4 projectedCoord;
    vec4 lastProjectedCoord;
    float unpackedDepth;
    vec4 depthTexel;

    for (int i = 0; i < steps; i++) {
        hitPos += dir;

        projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
        projectedCoord.xy /= projectedCoord.w;
        // [-1, 1] --> [0, 1] (NDC to screen position)
        projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

// the ray is outside the camera's frustum
#ifndef missedRays
        if (projectedCoord.x < 0.0 || projectedCoord.x > 1.0 || projectedCoord.y < 0.0 || projectedCoord.y > 1.0) {
            return INVALID_RAY_COORDS;
        }
#endif

        depthTexel = textureLod(depthTexture, projectedCoord.xy, 0.0);

        unpackedDepth = unpackRGBAToDepth(depthTexel);

        depth = fastGetViewZ(unpackedDepth);

        rayHitDepthDifference = depth - hitPos.z;

        if (rayHitDepthDifference >= 0.0 && rayHitDepthDifference < thickness) {
#if refineSteps == 0
            // filter out sky
            if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) return INVALID_RAY_COORDS;
#else
            return BinarySearch(dir, hitPos, rayHitDepthDifference);
#endif
        }

#ifndef missedRays
        // the ray is behind the camera
        if (hitPos.z > 0.0) {
            return INVALID_RAY_COORDS;
        }
#endif

        lastProjectedCoord = projectedCoord;
    }

    // since hitPos isn't used anywhere we can use it to mark that this reflection would have been invalid
    hitPos.z = 1.0;

#ifndef missedRays
    return INVALID_RAY_COORDS;
#endif

    rayHitDepthDifference = unpackedDepth;

    return projectedCoord.xy;
}

vec2 BinarySearch(in vec3 dir, inout vec3 hitPos, inout float rayHitDepthDifference) {
    float depth;
    vec4 projectedCoord;
    vec2 lastMinProjectedCoordXY;
    float unpackedDepth;
    vec4 depthTexel;

    for (int i = 0; i < refineSteps; i++) {
        projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
        projectedCoord.xy /= projectedCoord.w;
        projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

        depthTexel = textureLod(depthTexture, projectedCoord.xy, 0.0);

        unpackedDepth = unpackRGBAToDepth(depthTexel);
        depth = fastGetViewZ(unpackedDepth);

        rayHitDepthDifference = depth - hitPos.z;

        dir *= 0.5;

        if (rayHitDepthDifference > 0.0) {
            hitPos -= dir;
        } else {
            hitPos += dir;
        }
    }

    // filter out sky
    if (dot(depthTexel.rgb, depthTexel.rgb) < FLOAT_EPSILON) return INVALID_RAY_COORDS;

    if (abs(rayHitDepthDifference) > maxDepthDifference) return INVALID_RAY_COORDS;

    projectedCoord = _projectionMatrix * vec4(hitPos, 1.0);
    projectedCoord.xy /= projectedCoord.w;
    projectedCoord.xy = projectedCoord.xy * 0.5 + 0.5;

    rayHitDepthDifference = unpackedDepth;

    return projectedCoord.xy;
}

// source: https://github.com/mrdoob/three.js/blob/342946c8392639028da439b6dc0597e58209c696/examples/js/shaders/SAOShader.js#L123
float fastGetViewZ(const in float depth) {
#ifdef PERSPECTIVE_CAMERA
    return nearMulFar / (farMinusNear * depth - cameraFar);
#else
    return depth * nearMinusFar - cameraNear;
#endif
}

#include <common>
#include <cube_uv_reflection_fragment>

// from: https://github.com/mrdoob/three.js/blob/d5b82d2ca410e2e24ca2f7320212dfbee0fe8e89/src/renderers/shaders/ShaderChunk/envmap_physical_pars_fragment.glsl.js#L22
vec3 getIBLRadiance(const in vec3 viewDir, const in vec3 normal, const in float roughness) {
#if defined(ENVMAP_TYPE_CUBE_UV)
    vec3 reflectVec = reflect(-viewDir, normal);

    // Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.
    reflectVec = normalize(mix(reflectVec, normal, roughness * roughness));
    reflectVec = inverseTransformDirection(reflectVec, viewMatrix);

    vec4 envMapColor = textureCubeUV(envMap, reflectVec, roughness);
    return envMapColor.rgb * intensity;
#else
    return vec3(0.0);
#endif
}`
