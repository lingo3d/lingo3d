import Cube from "../display/primitives/Cube"
import "../display/core/PhysicsObjectManager/physx"
import Character from "../display/Character"
import ArticulationJoint from "../display/ArticulationJoint"

const ground = new Cube()
ground.width = 1000
ground.height = 10
ground.depth = 1000
ground.y = -300
ground.color = "blue"
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

torsoCube.rotationX = 45

const joint = new ArticulationJoint()
joint.jointChild = torsoCube
joint.jointParent = headCube
joint.y = 23

// const hatCube = new Cube()
// hatCube.scaleX = hatCube.scaleY = hatCube.scaleZ = 0.25
// hatCube.y = 80

// const hipCube = new Cube()
// hipCube.scaleX = 0.35
// hipCube.scaleY = 0.1
// hipCube.scaleZ = 0.2
// hipCube.y = -30
