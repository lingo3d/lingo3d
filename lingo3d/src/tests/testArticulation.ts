import Cube from "../display/primitives/Cube"
import "../display/core/PhysicsObjectManager/physx"
import Articulation from "../display/Articulation"

const ground = new Cube()
ground.width = 1000
ground.height = 10
ground.depth = 1000
ground.y = -300
ground.color = "black"
ground.physics = "map"

const torsoCube = new Cube()
torsoCube.scaleX = 0.35
torsoCube.scaleY = 0.45
torsoCube.scaleZ = 0.2

const headCube = new Cube()
headCube.scaleX = headCube.scaleY = headCube.scaleZ = 0.25
headCube.y = 40
torsoCube.attach(headCube)

const hipCube = new Cube()
hipCube.scaleX = 0.35
hipCube.scaleY = 0.1
hipCube.scaleZ = 0.2
hipCube.y = -30
torsoCube.attach(hipCube)

const articulation = new Articulation()
articulation.append(torsoCube)
