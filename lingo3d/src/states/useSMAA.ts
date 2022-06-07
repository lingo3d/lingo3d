import store from "@lincode/reactivity"
import isSafari from "../api/utils/isSafari"

export const [setSMAA, getSMAA] = store(isSafari)