import store, { push, pull } from "@lincode/reactivity"
import PhysicsMixin from "../display/core/mixins/PhysicsMixin"

const [setCentripetal, getCentripetal] = store<Array<PhysicsMixin>>([])
export { getCentripetal }

export const pushCentripetal = push(setCentripetal, getCentripetal)
export const pullCentripetal = pull(setCentripetal, getCentripetal)
