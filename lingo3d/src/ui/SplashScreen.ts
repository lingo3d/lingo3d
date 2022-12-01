import Appendable from "../api/core/Appendable"
import { container } from "../engine/renderLoop/renderSetup"
import ISplashScreen, {
    splashScreenDefaults,
    splashScreenSchema
} from "../interface/ISplashScreen"
import createElement from "../utils/createElement"

let initialized = false

const initCSS = () => {
    if (initialized) return
    initialized = true

    const style = createElement(`
        <style>
            .lingo3d-splashscreen {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                background: black;
            }
        </style>
    `)
    document.head.appendChild(style)
}

export default class SplashScreen extends Appendable implements ISplashScreen {
    public static componentName = "splashScreen"
    public static defaults = splashScreenDefaults
    public static schema = splashScreenSchema

    private splashScreen = createElement<HTMLDivElement>(
        '<div class="lingo3d-splashscreen" style="opacity: 0.75"></div>'
    )

    public constructor() {
        super()

        initCSS()
        container.appendChild(this.splashScreen)
        this.then(() => container.removeChild(this.splashScreen))
    }

    public get innerHTML() {
        return this.splashScreen.innerHTML
    }
    public set innerHTML(value) {
        this.splashScreen.innerHTML = value
    }

    public get opacity() {
        return Number(this.splashScreen.style.opacity)
    }
    public set opacity(value) {
        this.splashScreen.style.opacity = value + ""
    }
}
