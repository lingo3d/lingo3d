import { Cube, mouse, Sphere } from ".."

export default {}

const ball = new Sphere()
ball.id = "ball"
ball.scale = 0.5
ball.physics = true
ball.y = 300

const ball2 = new Sphere()
ball2.id = "ball2"
ball2.scale = 0.5
ball2.x = 100
ball2.physics = true
ball2.y = 300

const paddle = new Cube()
paddle.physics = true
paddle.mass = 0
paddle.scale = 2
mouse.onMouseMove = () => {
    paddle.x = mouse.x
    paddle.y = mouse.y
}

paddle.intersectIDs = ["ball"]
paddle.onIntersect = (target) => {
    target.applyImpulse(0, 1, 0)
}