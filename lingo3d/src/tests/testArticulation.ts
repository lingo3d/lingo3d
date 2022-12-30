import Cube from "../display/primitives/Cube"
import "../display/core/PhysicsObjectManager/physx"
import Character from "../display/Character"

const ground = new Cube()
ground.width = 1000
ground.height = 10
ground.depth = 1000
ground.y = -300
ground.color = "black"
ground.physics = "map"

const character = new Character()
character.x = -100

const torsoCube = new Cube()
torsoCube.scaleX = 0.35
torsoCube.scaleY = 0.45
torsoCube.scaleZ = 0.2

const headCube = new Cube()
headCube.scaleX = headCube.scaleY = headCube.scaleZ = 0.25
headCube.y = 40
torsoCube.attach(headCube)

const hatCube = new Cube()
hatCube.scaleX = hatCube.scaleY = hatCube.scaleZ = 0.25
hatCube.y = 80
headCube.attach(hatCube)

const hipCube = new Cube()
hipCube.scaleX = 0.35
hipCube.scaleY = 0.1
hipCube.scaleZ = 0.2
hipCube.y = -30
torsoCube.attach(hipCube)

torsoCube.physics = "articulation"
torsoCube.rotationX = 45