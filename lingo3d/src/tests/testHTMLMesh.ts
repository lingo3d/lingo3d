import HTMLMesh from "../display/HTMLMesh"
import Cube from "../display/primitives/Cube"
import createElement from "../utils/createElement"

export default {}

const mesh = new HTMLMesh()
mesh.element = createElement(`
    <div style="color: blue">hello world</div>
`)

const box = new Cube()
box.x = 150