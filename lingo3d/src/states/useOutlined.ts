import store, { push, pull } from "@lincode/reactivity"
import { Object3D } from "three"

const [setOutlined, getOutlined] = store<Array<Object3D>>([])
export { getOutlined }

export const pushOutlined = push(setOutlined, getOutlined)
export const pullOutlined = pull(setOutlined, getOutlined)