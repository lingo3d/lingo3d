import { TextureLoader, RepeatWrapping, Vector3, SphereBufferGeometry } from "three"
import { Water } from "three/examples/jsm/objects/Water.js"
import settings from "../api/settings"
import Sky from "../display/Sky"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"

export default {}

settings.skybox = [
    "skybox/Left.png", "skybox/Right.png", "skybox/Up.png", "skybox/Down.png", "skybox/Front.png", "skybox/Back.png"
]

const waterGeometry = new SphereBufferGeometry(10, 16, 16)

const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new TextureLoader().load(
        "waternormals.jpeg",
        function (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping
        }
    ),
    sunDirection: new Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7
})

water.rotation.x = -Math.PI / 2

scene.add(water)

onBeforeRender(() => {
    water.material.uniforms["time"].value += 1.0 / 60.0
})
