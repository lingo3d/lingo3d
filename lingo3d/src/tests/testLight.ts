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

const light = new PooledPointLight()

// const aura = new Sprite()
// aura.scale = 10
// aura.texture = "particle.jpg"
// aura.blending = "additive"
// aura.depthTest = false
// aura.$disableSelection = true

const dummy = new Dummy()
dummy.physics = "character"
dummy.y = -150

// onBeforeRender(() => {
//     aura.visible = light.isRendered
// })
