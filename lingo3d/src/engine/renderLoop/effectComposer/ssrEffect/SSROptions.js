/**
 * Options of the SSR effect
 * @typedef {Object} SSROptions
 * @property {Number} [intensity] intensity of the reflections
 * @property {Number} [exponent] exponent by which reflections will be potentiated when composing the current frame's reflections and the accumulated reflections into a final reflection; higher values will make reflections clearer by highlighting darker spots less
 * @property {Number} [distance] maximum distance a reflection ray can travel to find what it reflects
 * @property {Number} [fade] how much reflections will fade out by distance
 * @property {Number} [roughnessFade] how intense reflections should be on rough spots; a higher value will make reflections fade out quicker on rough spots
 * @property {Number} [thickness] maximum depth difference between a ray and the particular depth at its screen position before refining with binary search; higher values will result in better performance
 * @property {Number} [ior] Index of Refraction, used for calculating fresnel; reflections tend to be more intense the steeper the angle between them and the viewer is, the ior parameter sets how much the intensity varies
 * @property {Number} [maxRoughness] maximum roughness a texel can have to have reflections calculated for it
 * @property {Number} [maxDepthDifference] maximum depth difference between a ray and the particular depth at its screen position after refining with binary search; higher values will result in better performance
 * @property {Number} [blend] a value between 0 and 1 to set how much the last frame's reflections should be blended in; higher values will result in less noisy reflections when moving the camera but a more smeary look
 * @property {boolean} [correction] how much pixels should be corrected when doing temporal resolving; higher values will result in less smearing but more noise
 * @property {boolean} [correctionRadius] how many surrounding pixels will be used for neighborhood clamping; a higher value can reduce noise when moving the camera but will result in less performance
 * @property {Number} [blur] how much the blurred reflections should be mixed with the raw reflections
 * @property {Number} [blurKernel] kernel size of the Box Blur Filter; higher kernel sizes will result in blurrier reflections with more artifacts
 * @property {Number} [blurSharpness] exponent of the Box Blur filter; higher values will result in more sharpness
 * @property {Number} [jitter] how intense jittering should be
 * @property {Number} [jitterRoughness] how intense jittering should be in relation to a material's roughness
 * @property {Number} [steps] number of steps a reflection ray can maximally do to find an object it intersected (and thus reflects)
 * @property {Number} [refineSteps] once we had our ray intersect something, we need to find the exact point in space it intersected and thus it reflects; this can be done through binary search with the given number of maximum steps
 * @property {boolean} [missedRays] if there should still be reflections for rays for which a reflecting point couldn't be found; enabling this will result in stretched looking reflections which can look good or bad depending on the angle
 * @property {boolean} [useNormalMap] if roughness maps should be taken account of when calculating reflections
 * @property {boolean} [useRoughnessMap] if normal maps should be taken account of when calculating reflections
 * @property {Number} [resolutionScale] resolution of the SSR effect, a resolution of 0.5 means the effect will be rendered at half resolution
 * @property {Number} [velocityResolutionScale] resolution of the velocity buffer, a resolution of 0.5 means velocity will be rendered at half resolution
 */

/**
 * The options of the SSR effect
 * @type {SSROptions}
 */
export const defaultSSROptions = {
    intensity: 1,
    exponent: 1,
    distance: 6,
    fade: 0,
    roughnessFade: 1,
    thickness: 10,
    ior: 1.45,
    maxRoughness: 1,
    maxDepthDifference: 10,
    blend: 0.9,
    correction: 0.5,
    correctionRadius: 1,
    blur: 1,
    blurKernel: 2,
    blurSharpness: 0,
    jitter: 0.2,
    jitterRoughness: 0,
    steps: 1,
    refineSteps: 0,
    missedRays: true,
    useNormalMap: true,
    useRoughnessMap: true,
    resolutionScale: 1,
    velocityResolutionScale: 1
}
