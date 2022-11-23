import IGroup from "../../interface/IGroup"
import IModel from "../../interface/IModel"
import IDummy from "../../interface/IDummy"
import IBuilding from "../../interface/IBuilding"
import ITree from "../../interface/ITree"
import ISvgMesh from "../../interface/ISvgMesh"
import IHTMLMesh from "../../interface/IHTMLMesh"
import IReflector from "../../interface/IReflector"
import IWater from "../../interface/IWater"
import ICurve from "../../interface/ICurve"
import ISprite from "../../interface/ISprite"
import ITrigger from "../../interface/ITrigger"
import ISpawnPoint from "../../interface/ISpawnPoint"
import IAudio from "../../interface/IAudio"
import ICamera from "../../interface/ICamera"
import IAmbientLight from "../../interface/IAmbientLight"
import IAreaLight from "../../interface/IAreaLight"
import IDirectionalLight from "../../interface/IDirectionalLight"
import ISkyLight from "../../interface/ISkyLight"
import IPointLight from "../../interface/IPointLight"
import ISpotLight from "../../interface/ISpotLight"
import IPrimitive from "../../interface/IPrimitive"
import ISkybox from "../../interface/ISkybox"
import IEnvironment from "../../interface/IEnvironment"
import ISetup from "../../interface/ISetup"
import ITimeline from "../../interface/ITimeline"
import { AnimationData } from "../../interface/IAnimationManager"

export type GameObjectType =
    | "group"
    | "model"
    | "dummy"
    | "building"
    | "tree"
    | "svgMesh"
    | "htmlMesh"
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

export type VersionNode = {
    type: "lingo3d"
    version: string
}

export type AnimationNode = {
    type: "animation"
    data: AnimationData
}

type Node = {
    type: GameObjectType
    children?: Array<BaseSceneGraphNode>
}

export const nonSerializedProperties = [
    "type",
    "children",
    "scale",
    "rotation",
    "velocity",
    "target",
    "proxy",
    "gridHelper",
    "gridHelperSize",
    "stats"
]

type TypedPropsNode<Props, Type extends GameObjectType> = Partial<Props> &
    Node & { type: Type }

export type GroupNode = TypedPropsNode<IGroup, "group">

export type ModelNode = TypedPropsNode<IModel, "model">

export type DummyNode = TypedPropsNode<IDummy, "dummy">

export type BuildingNode = TypedPropsNode<IBuilding, "building">

export type TreeNode = TypedPropsNode<ITree, "tree">

export type SvgMeshNode = TypedPropsNode<ISvgMesh, "svgMesh">

export type HTMLMeshNode = TypedPropsNode<IHTMLMesh, "htmlMesh">

export type ReflectorNode = TypedPropsNode<IReflector, "reflector">

export type WaterNode = TypedPropsNode<IWater, "water">

export type CurveNode = TypedPropsNode<ICurve, "curve">

export type SpriteNode = TypedPropsNode<ISprite, "sprite">

export type TriggerNode = TypedPropsNode<ITrigger, "trigger">

export type SpawnPointNode = TypedPropsNode<ISpawnPoint, "spawnPoint">

export type AudioNode = TypedPropsNode<IAudio, "audio">

export type CameraNode = TypedPropsNode<ICamera, "camera">

export type AmbientLightNode = TypedPropsNode<IAmbientLight, "ambientLight">

export type AreaLightNode = TypedPropsNode<IAreaLight, "areaLight">

export type DirectionalLightNode = TypedPropsNode<
    IDirectionalLight,
    "directionalLight"
>

export type SkyLightNode = TypedPropsNode<ISkyLight, "skyLight">

export type PointLightNode = TypedPropsNode<IPointLight, "pointLight">

export type SpotLightNode = TypedPropsNode<ISpotLight, "spotLight">

export type CircleNode = TypedPropsNode<IPrimitive, "circle">

export type ConeNode = TypedPropsNode<IPrimitive, "cone">

export type CubeNode = TypedPropsNode<IPrimitive, "cube">

export type CylinderNode = TypedPropsNode<IPrimitive, "cylinder">

export type OctahedronNode = TypedPropsNode<IPrimitive, "octahedron">

export type PlaneNode = TypedPropsNode<IPrimitive, "plane">

export type SphereNode = TypedPropsNode<IPrimitive, "sphere">

export type TetrahedronNode = TypedPropsNode<IPrimitive, "tetrahedron">

export type TorusNode = TypedPropsNode<IPrimitive, "torus">

export type SkyboxNode = TypedPropsNode<ISkybox, "skybox">

export type EnvironmentNode = TypedPropsNode<IEnvironment, "environment">

export type SetupNode = TypedPropsNode<ISetup, "setup">

export type TimelineNode = TypedPropsNode<ITimeline, "timeline">

export type BaseSceneGraphNode =
    | GroupNode
    | ModelNode
    | DummyNode
    | BuildingNode
    | TreeNode
    | SvgMeshNode
    | HTMLMeshNode
    | ReflectorNode
    | WaterNode
    | CurveNode
    | SpriteNode
    | TriggerNode
    | SpawnPointNode
    | AudioNode
    | CameraNode
    | AmbientLightNode
    | AreaLightNode
    | DirectionalLightNode
    | SkyLightNode
    | PointLightNode
    | SpotLightNode
    | CircleNode
    | ConeNode
    | CubeNode
    | CylinderNode
    | OctahedronNode
    | PlaneNode
    | SphereNode
    | TetrahedronNode
    | TorusNode
    | SkyboxNode
    | EnvironmentNode
    | SetupNode
    | TimelineNode

export type SceneGraphNode = BaseSceneGraphNode | AnimationNode | VersionNode
