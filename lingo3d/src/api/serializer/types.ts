import IGroup from "../../interface/IGroup"
import IModel from "../../interface/IModel"
import IDummy from "../../interface/IDummy"
import IBuilding from "../../interface/IBuilding"
import ISvgMesh from "../../interface/ISvgMesh"
import IReflector from "../../interface/IReflector"
import ISprite from "../../interface/ISprite"
import ITrigger from "../../interface/ITrigger"
import IAudio from "../../interface/IAudio"
import ICamera from "../../interface/ICamera"
import IAmbientLight from "../../interface/IAmbientLight"
import IAreaLight from "../../interface/IAreaLight"
import IDirectionalLight from "../../interface/IDirectionalLight"
import ISkyLight from "../../interface/ISkyLight"
import IPointLight from "../../interface/IPointLight"
import ISpotLight from "../../interface/ISpotLight"
import IPrimitive from "../../interface/IPrimitive"
import ISetup from "../../interface/ISetup"
import ISkybox from "../../interface/ISkybox"
import IEnvironment from "../../interface/IEnvironment"

export type GameObjectType = "group" | "model" | "dummy" | "building" | "svgMesh" | "reflector" | "sprite" | "trigger" | "audio" | "ambientLight" | "areaLight" | "directionalLight" | "skyLight" | "pointLight" | "spotLight" | "camera" | "orbitCamera" | "thirdPersonCamera" | "firstPersonCamera" | "circle" | "cone" | "cube" | "cylinder" | "octahedron" | "plane" | "sphere" | "tetrahedron" | "torus" | "skybox" | "environment"

export type AnimationData = Record<
    string,//property name
    Record<
        string,//frame number cast as string
        number//frame value
    >
>

export type AnimationNode = {
    type: "animation"
    data: Record<
        string,//target name
        AnimationData
    >
}

export type SetupNode = ISetup & {
    type: "setup"
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
    "proxy"
]
export const nonEditorSettings: Array<keyof ISetup> = [
    "defaultOrbitControls",
    "autoMount",
    "texture",
    "color"
]
export const nonSerializedSettings: Array<keyof ISetup> = [
    ...nonEditorSettings,
    "gridHelper",
    "gridHelperSize"
]

type TypedPropsNode<Props, Type extends GameObjectType> = Partial<Props> & Node & { type: Type }

export type GroupNode = TypedPropsNode<IGroup, "group">

export type ModelNode = TypedPropsNode<IModel, "model">

export type DummyNode = TypedPropsNode<IDummy, "dummy">

export type BuildingNode = TypedPropsNode<IBuilding, "building">

export type SvgMeshNode = TypedPropsNode<ISvgMesh, "svgMesh">

export type ReflectorNode = TypedPropsNode<IReflector, "reflector">

export type SpriteNode = TypedPropsNode<ISprite, "sprite">

export type TriggerNode = TypedPropsNode<ITrigger, "trigger">

export type AudioNode = TypedPropsNode<IAudio, "audio">

export type CameraNode = TypedPropsNode<ICamera, "camera">

export type AmbientLightNode = TypedPropsNode<IAmbientLight, "ambientLight">

export type AreaLightNode = TypedPropsNode<IAreaLight, "areaLight">

export type DirectionalLightNode = TypedPropsNode<IDirectionalLight, "directionalLight">

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

export type BaseSceneGraphNode = GroupNode | ModelNode | DummyNode | BuildingNode | SvgMeshNode | ReflectorNode | SpriteNode | TriggerNode | AudioNode | CameraNode | AmbientLightNode | AreaLightNode | DirectionalLightNode | SkyLightNode | PointLightNode | SpotLightNode | CircleNode | ConeNode | CubeNode | CylinderNode | OctahedronNode | PlaneNode | SphereNode | TetrahedronNode | TorusNode | SkyboxNode | EnvironmentNode

export type SceneGraphNode = BaseSceneGraphNode | AnimationNode | SetupNode