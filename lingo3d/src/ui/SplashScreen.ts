import Appendable from "../api/core/Appendable"
import { uiContainer } from "../engine/renderLoop/renderSetup"
import ISplashScreen, {
    splashScreenDefaults,
    splashScreenSchema
} from "../interface/ISplashScreen"
import createElement from "../utils/createElement"
import getPrivateValue from "../utils/getPrivateValue"
import Text from "./Text"

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
        `<div class="lingo3d-splashscreen" style="opacity: 1"></div>`
    )
    private textContainer = document.createElement("div")

    public constructor() {
        super()

        initCSS()
        uiContainer.appendChild(this.splashScreen)
        this.splashScreen.appendChild(this.textContainer)
        this.then(() => this.splashScreen.remove())
    }

    public get opacity() {
        return Number(this.splashScreen.style.opacity)
    }
    public set opacity(value) {
        this.splashScreen.style.opacity = value + ""
    }

    public get textCenter() {
        return this.textContainer.style.textAlign === "center"
    }
    public set textCenter(value) {
        this.textContainer.style.textAlign = value ? "center" : ""
    }

    public override append(child: Text) {
        this._append(child)
        this.textContainer.appendChild(getPrivateValue(child, "el"))
    }

    public override attach(child: Text) {
        this.append(child)
    }
}
