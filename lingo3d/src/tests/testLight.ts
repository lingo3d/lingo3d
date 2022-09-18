import { AreaLight, Cube } from ".."

let box = new Cube()

let light = new AreaLight()
light.z = 3000
light.y = 3000
light.lookAt(box)