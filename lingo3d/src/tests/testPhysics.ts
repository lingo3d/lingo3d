import { Cube, Cylinder, pillShape, Torus } from "../index"

export default {}

const pole2 = new Cylinder()
pole2.scaleX = pole2.scaleZ = 0.2
pole2.rotationZ = 90
pole2.y = 500
pole2.physics = true

const torus = new Torus()
torus.rotationX = 90
torus.y = 200
torus.x = 25
torus.physics = true

const pole = new Cylinder()
pole.scaleX = pole.scaleZ = 0.2
pole.physics = true
pole.physicsShape = pillShape

const floor = new Cube()
floor.width = floor.depth = 9999
floor.y = -100
floor.physics = true
floor.mass = 0

torus.onMouseOver = () => {
    console.log("over")
    torus.applyImpulse(0, 10, 0)
}

torus.onMouseOut = () => {
    console.log("out")
}

torus.onClick = () => {
    console.log("click")
}