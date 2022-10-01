import { Model, Cube, OrbitCamera, Sky } from ".."
import { random } from "@lincode/utils"

const sky = new Sky()

const island = new Model()
island.src = "island.glb"

const island2 = new Model()
island2.src = "island.glb"
island.append(island2)
island2.y = -30
island2.scale = 0.7
island2.rotationY = 90

const island3 = new Model()
island3.src = "island.glb"
island.append(island3)
island3.y = -40
island3.scale = 0.6
island3.rotationY = 180

const makeCharacter = () => {
    const character = new Model()
    character.src = "character.glb"
    character.scale = 0.05
    character.y = 50
    return character
}

for (let i = -2; i <= 2; ++i) {
    for (let j = -2; j <= 2; ++j) {
        const character = makeCharacter()
        character.x = i * 10 - 10 + random(-5, 5)
        character.z = j * 10 + random(-5, 5)
    }
}

const monolith = new Cube()
monolith.width = 1
monolith.height = 20
monolith.depth = 15
monolith.y = 60
monolith.x = 30
monolith.bloom = true
monolith.texture = "wave1.mp4"

const camera = new OrbitCamera()
camera.active = true
// camera.targetY = 50
// camera.azimuthAngle = 235
// camera.polarAngle = 70
// camera.distance = 100
camera.enableDamping = true
camera.enableZoom = true
