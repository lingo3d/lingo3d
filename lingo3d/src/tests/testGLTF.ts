import { random } from "@lincode/utils"
import { ParticleSystem, timer } from ".."
//@ts-ignore
import parrotSrc from "../../assets-local/parrot.glb"
//@ts-ignore
import shipSrc from "../../assets-local/ship1.glb"
import Model from "../display/Model"

export default {}

// const model = new Model()
// model.src = parrotSrc
// model.scale = 3
// model.playAnimation()

// const model2 = new Model()
// model2.src = parrotSrc
// model2.scale = 3
// model2.playAnimation()
// model2.x = 100

// model.onLoop = () => model.depth -= 0.1

const makefire = function () {
    const fire = new ParticleSystem()
    fire.size = 20
    fire.sizeEnd = 0
    fire.spread = 0.3
    fire.color="blue"
    fire.colorEnd = "white"
    fire.bloom = true

    return fire
}

const makeEnemy = () => {
    const ship = new Model()
    ship.src = shipSrc
    ship.innerRotationX = 90
    ship.scale = 0.5
    ship.x = random(-200, 200)
    ship.y = 300

    const fire0 = makefire()
    //敌人添加火焰，火焰就会到敌人身上去
    ship.append(fire0)
    fire0.x = -50
    //fire的速度越大，就喷射的越远
    fire0.speed = 5

    //另一团火
    const fire1 = makefire()
    ship.append(fire1)
    //让学生自己试试，x改成多少，能把火放到敌人的另一个引擎上?
    fire1.x = 50
    fire1.speed = 5

    ship.onLoop = () => {
        ship.y -= 1
        ship.rotationY += 1
    }
}

timer(1000, Infinity, makeEnemy)