import IGroup from "../../../interface/IGroup"
import IModel from "../../../interface/IModel"
import ISvgMesh from "../../../interface/ISvgMesh"
import IReflector from "../../../interface/IReflector"
import ISprite from "../../../interface/ISprite"
import ICamera from "../../../interface/ICamera"
import IAmbientLight from "../../../interface/IAmbientLight"
import IAreaLight from "../../../interface/IAreaLight"
import IDirectionalLight from "../../../interface/IDirectionalLight"
import ISkyLight from "../../../interface/ISkyLight"
import IPointLight from "../../../interface/IPointLight"
import ISpotLight from "../../../interface/ISpotLight"
import IPrimitive from "../../../interface/IPrimitive"
import ISetup from "../../../interface/ISetup"
import ISkybox from "../../../interface/ISkybox"

export type GameObjectType = "group" | "model" | "svgMesh" | "reflector" | "sprite" | "ambientLight" | "areaLight" | "directionalLight" | "skyLight" | "pointLight" | "spotLight" | "camera" | "orbitCamera" | "thirdPersonCamera" | "firstPersonCamera" | "circle" | "cone" | "cube" | "cylinder" | "octahedron" | "plane" | "sphere" | "tetrahedron" | "torus" | "skybox"

export type AnimationData = Record<
    string,//property name
    Record<
        string,//frame number cast as string
        number//frame value
    >
>

export type AnimationNode = {
    type: "animation"
    name: string
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
    name?: string
    children?: Array<BaseSceneGraphNode>
}

export const nonSerializedProperties = <const>["type", "name", "children", "scale"]

type TypedPropsNode<Props, Type extends GameObjectType> = Partial<Props> & Node & { type: Type }

export type GroupNode = TypedPropsNode<IGroup, "group">

export type ModelNode = TypedPropsNode<IModel, "model">

export type SvgMeshNode = TypedPropsNode<ISvgMesh, "svgMesh">

export type ReflectorNode = TypedPropsNode<IReflector, "reflector">

export type SpriteNode = TypedPropsNode<ISprite, "sprite">

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

export type BaseSceneGraphNode = GroupNode | ModelNode | SvgMeshNode | ReflectorNode | SpriteNode | CameraNode | AmbientLightNode | AreaLightNode | DirectionalLightNode | SkyLightNode | PointLightNode | SpotLightNode | CircleNode | ConeNode | CubeNode | CylinderNode | OctahedronNode | PlaneNode | SphereNode | TetrahedronNode | TorusNode | SkyboxNode

export type SceneGraphNode = BaseSceneGraphNode | AnimationNode | SetupNode