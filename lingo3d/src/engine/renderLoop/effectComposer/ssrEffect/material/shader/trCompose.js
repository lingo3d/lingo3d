export default `#define INV_EULER 0.36787944117144233

alpha = 0.0;

// alpha = velocityDisocclusion < FLOAT_EPSILON ? (alpha + 0.0075) : 0.0;
// alpha = clamp(alpha, 0.0, 1.0);

bool needsBlur = !didReproject || velocityDisocclusion > 0.5;

#ifdef boxBlur
if (needsBlur) inputColor = boxBlurredColor;
#endif

if (alpha == 1.0) {
    outputColor = accumulatedColor;
} else {
    float m = mix(alpha, 1.0, blend);

    // if there's been an abrupt change (e.g. teleporting) then we need to entirely use the input color
    if (needsBlur) m = 0.0;

    outputColor = accumulatedColor * m + inputColor * (1.0 - m);
}
`
