import { Shader, ShaderMaterial, UniformsUtils, WebGLRenderTarget } from "three"

export default (
    width: number,
    height: number,
    shader: Shader,
    material = new ShaderMaterial({
        //@ts-ignore
        defines: Object.assign({}, shader.defines),
        uniforms: UniformsUtils.clone(shader.uniforms),
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    })
) => {
    const renderTarget = new WebGLRenderTarget(width, height)
    material.uniforms["tDiffuse"].value = renderTarget.texture
    return { renderTarget, material }
}
