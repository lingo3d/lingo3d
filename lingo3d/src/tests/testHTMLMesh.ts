import HTMLMesh from "../display/HTMLMesh"
import Cube from "../display/primitives/Cube"
import createElement from "../utils/createElement"

const mesh = new HTMLMesh()
mesh.element = createElement(`
    <div style="color: blue">hello world</div>
`)
mesh.sprite = true

const box = new Cube()
box.x = 150