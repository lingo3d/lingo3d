import keyboard from "../display/Keyboard"
import PointLight from "../display/lights/PointLight"
import Model from "../display/Model"

const model = new Model()
model.src = "chaoshi.glb"
model.scale = 10
// model.physics = "map"

const light = new PointLight()
light.castShadow = true

document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        //@ts-ignore
        light.lightState.get((light) => {
            if (!light) return
            light.castShadow = true
            light.shadow.autoUpdate = !light.shadow.autoUpdate
        })
    }
})
