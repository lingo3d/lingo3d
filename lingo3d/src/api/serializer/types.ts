import IModel from "../../interface/IModel"

export type GameObjectType =
    | "group"
    | "model"
    | "dummy"
    | "building"
    | "tree"
    | "svgMesh"
    | "htmlMesh"
    | "joystick"
    | "reticle"
    | "splashScreen"
    | "text"
    | "mouse"
    | "keyboard"
    | "reflector"
    | "water"
    | "curve"
    | "sprite"
    | "spriteSheet"
    | "spawnPoint"
    | "sphericalJoint"
    | "fixedJoint"
    | "revoluteJoint"
    | "prismaticJoint"
    | "d6Joint"
    | "audio"
    | "ambientLight"
    | "areaLight"
    | "directionalLight"
    | "skyLight"
    | "defaultSkyLight"
    | "pointLight"
    | "spotLight"
    | "camera"
    | "orbitCamera"
    | "thirdPersonCamera"
    | "firstPersonCamera"
    | "circle"
    | "cone"
    | "cube"
    | "cylinder"
    | "octahedron"
    | "plane"
    | "sphere"
    | "tetrahedron"
    | "torus"
    | "skybox"
    | "environment"
    | "setup"
    | "timeline"
    | "timelineAudio"
    | "gameGraph"
    | "connector"
    | "mathNode"
    | "incrementNode"
    | "projectionNode"
    | "spawnNode"

type VersionNode = {
    type: "lingo3d"
    version: string
}

type Node = {
    type: GameObjectType
    children?: Array<AppendableNode>
}
type AppendableNode = Partial<IModel> & Node

export type SceneGraphNode = AppendableNode | VersionNode
