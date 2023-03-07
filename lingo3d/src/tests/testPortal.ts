import Model from "../display/Model"
import Portal from "../display/Portal"
import Cube from "../display/primitives/Cube"

const map = new Model()
map.scale = 10
map.src = "cathedral.glb"

const map2 = new Model()
map2.scale = 4
map2.src = "fangjian11.glb"
map2.x = 2000

const portal = new Portal()
portal.width = 200
portal.height = 400

const target = new Cube()
target.x = 1950.00
target.y = -60.00
target.z = 180.00
target.rotationY = 30

portal.target = target
