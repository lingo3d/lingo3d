export default `uniform float blur;
uniform float blurSharpness;
uniform int blurKernel;

// algorithm is from: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/denoise.js
vec3 denoise(vec3 center, sampler2D tex, vec2 uv, vec2 invTexSize, float blur, float blurSharpness, int blurKernel) {
    vec3 color;
    float total;
    vec3 col;
    float weight;

    for (int x = -blurKernel; x <= blurKernel; x++) {
        for (int y = -blurKernel; y <= blurKernel; y++) {
            col = textureLod(tex, uv + vec2(x, y) * invTexSize, 0.).rgb;
            weight = 1.0 - abs(dot(col - center, vec3(0.25)));
            weight = pow(weight, blurSharpness);
            color += col * weight;
            total += weight;
        }
    }

    return color / total;
}`
