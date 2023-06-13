import { Cube } from ".."

const cube = new Cube()
cube.texture = "road.jpg"

setTimeout(() => {
    cube.textureRepeat = 4
}, 1000)
