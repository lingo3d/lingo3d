import IGroup from "../../../interface/IGroup"
import IModel from "../../../interface/IModel"
import ISvgMesh from "../../../interface/ISvgMesh"
import ISprite from "../../../interface/ISprite"
import IReflector from "../../../interface/IReflector"
import IScene from "../../../interface/IScene"
import ICamera from "../../../interface/ICamera"
import IAmbientLight from "../../../interface/IAmbientLight"
import IAreaLight from "../../../interface/IAreaLight"
import IDirectionalLight from "../../../interface/IDirectionalLight"
import ISkyLight from "../../../interface/ISkyLight"
import IPointLight from "../../../interface/IPointLight"
import ISpotLight from "../../../interface/ISpotLight"
import IPrimitive from "../../../interface/IPrimitive"
import ISetup from "../../../interface/ISetup"


export type GameObjectType = "group" | "model" | "svgMesh" | "sprite" | "reflector" | "scene" | "ambientLight" | "areaLight" | "directionalLight" | "skyLight" | "pointLight" | "spotLight" | "camera" | "circle" | "cone" | "cube" | "cylinder" | "octahedron" | "plane" | "sphere" | "tetrahedron" | "torus"

export type AnimationData = Record<
    string,//property name
    Record<
        string,//frame number cast as string
        number//frame value
    >
>

export type AnimationNode = {
    type: "animation"
    uuid: string
    name: string
    data: Record<
        string,//target uuid
        AnimationData
    >
}

export type SetupNode = ISetup & {
    type: "setup"
}

type Node = {
    type: GameObjectType
    uuid: string
    name?: string
    children?: Array<BaseSceneGraphNode>
}

export const nonSerializedProperties = <const>["type", "uuid", "name", "children"]

type TypedPropsNode<Props, Type extends GameObjectType> = Partial<Props> & Node & { type: Type }

export type GroupNode = TypedPropsNode<IGroup, "group">

export type ModelNode = TypedPropsNode<IModel, "model">

export type SvgMeshNode = TypedPropsNode<ISvgMesh, "svgMesh">

export type SpriteNode = TypedPropsNode<ISprite, "sprite">

export type ReflectorNode = TypedPropsNode<IReflector, "reflector">

export type SceneNode = TypedPropsNode<IScene, "scene">

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

export type BaseSceneGraphNode = GroupNode | ModelNode | SvgMeshNode | SpriteNode | ReflectorNode | SceneNode | CameraNode | AmbientLightNode | AreaLightNode | DirectionalLightNode | SkyLightNode | PointLightNode | SpotLightNode | CircleNode | ConeNode | CubeNode | CylinderNode | OctahedronNode | PlaneNode | SphereNode | TetrahedronNode | TorusNode

export type SceneGraphNode = BaseSceneGraphNode | AnimationNode | SetupNode