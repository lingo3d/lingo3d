//@ts-ignore
import islandSrc from "../../assets-local/island.glb"
import Model from "../display/Model"
//@ts-ignore
import characterSrc from "../../assets-local/character.glb"
import { random } from "@lincode/utils"
import Cube from "../display/primitives/Cube"
//@ts-ignore
import waveSrc from "../../assets-local/wave1.mp4"
import OrbitCamera from "../display/cameras/OrbitCamera"
import { settings, Sky } from ".."

export default {}

settings.fillWindow = true

const sky = new Sky()

const island = new Model()
island.src = islandSrc

const island2 = new Model()
island2.src = islandSrc
island.append(island2)
island2.y = -30
island2.scale = 0.7
island2.rotationY = 90

const island3 = new Model()
island3.src = islandSrc
island.append(island3)
island3.y = -40
island3.scale = 0.6
island3.rotationY = 180

const makeCharacter = () => {
    const character = new Model()
    character.src = characterSrc
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
monolith.texture = waveSrc

const camera = new OrbitCamera()
camera.activate()
camera.targetY = 50
camera.setRotationY(235)
camera.setRotationX(-20)
camera.setDistance(100)
camera.enableDamping = true
camera.autoRotate = true
camera.bokeh = true