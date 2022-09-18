import { random } from "@lincode/utils"
import { PlaneGeometry, MeshPhongMaterial, Mesh } from "three"
import scene from "../engine/scene"

const geometry = new PlaneGeometry(60, 60, 9, 9)

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
  