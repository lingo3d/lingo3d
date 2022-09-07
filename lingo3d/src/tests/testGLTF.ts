import HTMLMesh from "../display/HTMLMesh"
import createElement from "../utils/createElement"
import { GUI } from "lil-gui"

export default {}

const parameters = {
    radius: 0.6,
    tube: 0.2,
    tubularSegments: 150,
    radialSegments: 20,
    p: 2,
    q: 3,
    thickness: 0.5
}

const gui = new GUI({ width: 300 })
gui.add(parameters, "radius", 0.0, 1.0)
gui.add(parameters, "tube", 0.0, 1.0)
gui.add(parameters, "tubularSegments", 10, 150, 1)
gui.add(parameters, "radialSegments", 2, 20, 1)
gui.add(parameters, "p", 1, 10, 1)
gui.add(parameters, "q", 0, 10, 1)
gui.add(parameters, "thickness", 0, 1)
gui.domElement.style.visibility = "hidden"

const mesh = new HTMLMesh()
mesh.element = gui.domElement