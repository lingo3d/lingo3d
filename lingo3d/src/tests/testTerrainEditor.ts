import { random } from "@lincode/utils"
import { PlaneBufferGeometry, MeshPhongMaterial, Mesh } from "three"
import settings from "../api/settings"
import scene from "../engine/scene"

export default {}

settings.defaultOrbitControls = true

const geometry = new PlaneBufferGeometry(60, 60, 9, 9)

const material = new MeshPhongMaterial({
    color: 0xdddddd, 
    wireframe: true
})
  
const plane = new Mesh(geometry, material)
scene.add(plane)

const vertices = geometry.attributes.position.array

for (let i = 2; i < vertices.length; i += 3) {
    //@ts-ignore
    vertices[i] = random(-1, 1)
}
  