import {
    DefaultSkyLight,
    Dummy,
    PooledPointLight,
    Sprite,
    onBeforeRender
} from ".."
import Cube from "../display/primitives/Cube"

const skylight = new DefaultSkyLight()
skylight.intensity = 0.2

const ground = new Cube()
ground.y = -300
ground.scaleX = 1000
ground.scaleZ = 1000


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
