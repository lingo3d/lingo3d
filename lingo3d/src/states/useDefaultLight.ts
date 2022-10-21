import store from "@lincode/reactivity"
import { EnvironmentPreset } from "../interface/IEnvironment"

type DefaultLight = boolean | EnvironmentPreset | string

export const [setDefaultLight, getDefaultLight] = store<DefaultLight>(true)
