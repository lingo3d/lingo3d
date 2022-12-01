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
    | "reflector"
    | "water"
    | "curve"
    | "sprite"
    | "trigger"
    | "spawnPoint"
    | "audio"
    | "ambientLight"
    | "areaLight"
    | "directionalLight"
    | "skyLight"
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
