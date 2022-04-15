import store from "@lincode/reactivity"
import { debounce } from "@lincode/utils"

const isMobile = () => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return true
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return true
    }
    return false
}

const [setMobile, getMobile] = store(isMobile())
export { getMobile }

const setMobileDebounced = debounce(() => setMobile(isMobile()), 100, "trailing")

window.addEventListener("resize", setMobileDebounced)