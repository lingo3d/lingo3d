import { lazy,  } from "@lincode/utils"
import { GRAVITY } from "../../../../../globals"
import { setPhysicsWorld } from "../../../../../states/usePhysicsWorld"

export default lazy(async () => {
    const { World, GSSolver, SplitSolver, NaiveBroadphase, Material, ContactMaterial, Body, Vec3, Box, Sphere, Cylinder } = await import("cannon-es")

    const world = new World()
    world.gravity.set(0, -GRAVITY, 0)

    world.quatNormalizeSkip = 0
    world.quatNormalizeFast = false

    const solver = new GSSolver()

    world.defaultContactMaterial.contactEquationStiffness = 1e9
    world.defaultContactMaterial.contactEquationRelaxation = 4

    solver.iterations = 7
    solver.tolerance = 0.1
    const split = true
    if(split)
        world.solver = new SplitSolver(solver)
    else
        world.solver = solver

    world.broadphase = new NaiveBroadphase()

    const [defaultMaterial] = world.defaultContactMaterial.materials
    const slipperyMaterial = new Material("slipperyMaterial")

    world.addContactMaterial(new ContactMaterial(slipperyMaterial, slipperyMaterial, {
        friction: 0.0, restitution: 0.0
    }))
    world.addContactMaterial(new ContactMaterial(slipperyMaterial, defaultMaterial, {
        friction: 0.001, restitution: 0.0
    }))

    setPhysicsWorld(world)
    return { world, defaultMaterial, slipperyMaterial, Body, Vec3, Box, Sphere, Cylinder }
})