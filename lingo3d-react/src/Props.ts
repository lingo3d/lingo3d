import React from "react"
import ICamera from "lingo3d/lib/interface/ICamera"
import IKeyboard from "lingo3d/lib/interface/IKeyboard"
import ILoaded from "lingo3d/lib/interface/ILoaded"
import IModel from "lingo3d/lib/interface/IModel"
import IDummy from "lingo3d/lib/interface/IDummy"
import ISvgMesh from "lingo3d/lib/interface/ISvgMesh"
import IMouse from "lingo3d/lib/interface/IMouse"
import IObjectManager from "lingo3d/lib/interface/IObjectManager"
import IOrbitCamera from "lingo3d/lib/interface/IOrbitCamera"
import IPrimitive from "lingo3d/lib/interface/IPrimitive"
import ISkybox from "lingo3d/lib/interface/ISkybox"
import ICharacterCamera from "lingo3d/lib/interface/ICharacterCamera"
import IAreaLight from "lingo3d/lib/interface/IAreaLight"
import IPointLight from "lingo3d/lib/interface/IPointLight"
import ISkyLight from "lingo3d/lib/interface/ISkyLight"
import ISpotLight from "lingo3d/lib/interface/ISpotLight"
import IReflector from "lingo3d/lib/interface/IReflector"
import ISprite from "lingo3d/lib/interface/ISprite"
import ISound from "lingo3d/lib/interface/ISound"
import IAmbientLight from "lingo3d/lib/interface/IAmbientLight"
import IDirectionalLight from "lingo3d/lib/interface/IDirectionalLight"
import IFound from "lingo3d/lib/interface/IFound"
import ITrigger from "lingo3d/lib/interface/ITrigger"

type Children = React.ReactNode

export type ManagerProps = Partial<IObjectManager> & { children?: Children }
export type FoundProps = Partial<IFound> & { children?: Children }
export type PrimitiveProps = Partial<IPrimitive> & { children?: Children }
export type LoadedProps = Partial<ILoaded> & { children?: Children }
export type ModelProps = Partial<IModel> & { children?: Children }
export type DummyProps = Partial<IDummy> & { children?: Children }
export type SvgMeshProps = Partial<ISvgMesh> & { children?: Children }
export type ReflectorProps = Partial<IReflector> & { children?: Children }
export type SpriteProps = Partial<ISprite> & { children?: Children }

export type CameraProps = Partial<ICamera> & { children?: Children }
export type OrbitCameraProps = Partial<IOrbitCamera> & { children?: Children }
export type ThirdPersonCameraProps = Partial<ICharacterCamera> & { children?: Children }
export type FirstPersonCameraProps = Partial<ICharacterCamera> & { children?: Children }

export type AmbientLightProps = Partial<IAmbientLight> & { children?: Children }
export type AreaLightProps = Partial<IAreaLight> & { children?: Children }
export type DirectionalLightProps = Partial<IDirectionalLight> & { children?: Children }
export type PointLightProps = Partial<IPointLight> & { children?: Children }
export type SkyLightProps = Partial<ISkyLight> & { children?: Children }
export type SpotLightProps = Partial<ISpotLight> & { children?: Children }

export type KeyboardProps = Partial<IKeyboard>
export type MouseProps = Partial<IMouse>
export type SoundProps = Partial<ISound>
export type TriggerProps = Partial<ITrigger>
export type SkyboxProps = Partial<ISkybox>