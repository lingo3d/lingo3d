import { DefaultSkyLight, Dummy, PooledPointLight, settings } from ".."

settings.gridY = -230

const skylight = new DefaultSkyLight()
skylight.intensity = 0.2

for (let i = 0; i < 10; ++i) {
    const light = new PooledPointLight()
    light.z = -i * 1000

    const dummy = new Dummy()
    dummy.physics = "character"
    dummy.y = -150
    dummy.z = -i * 1000 + 100
    dummy.x = 100
    dummy.strideForward = -10
}

// const aura = new Sprite()
// aura.scale = 10
// aura.texture = "particle.jpg"
// aura.blending = "additive"
// aura.depthTest = false
// aura.$disableSelection = true

// onBeforeRender(() => {
//     aura.visible = light.isRendered
// })
