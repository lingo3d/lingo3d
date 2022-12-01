import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"
import { container } from "../engine/renderLoop/renderSetup"
import ISplashScreen, {
    splashScreenDefaults,
    splashScreenSchema
} from "../interface/ISplashScreen"
import createElement from "../utils/createElement"

export default class SplashScreen extends Appendable implements ISplashScreen {
    public static componentName = "splashScreen"
    public static defaults = splashScreenDefaults
    public static schema = splashScreenSchema

    public constructor() {
        super()

        this.createEffect(() => {
            const innerHTML = this.innerHTMLState.get()
            if (!innerHTML) return

            const imageElement = createElement(innerHTML)
            container.appendChild(imageElement)

            return () => {
                container.removeChild(imageElement)
            }
        }, [this.innerHTMLState.get])
    }

    private innerHTMLState = new Reactive<string | undefined>(undefined)
    public get innerHTML() {
        return this.innerHTMLState.get()
    }
    public set innerHTML(value) {
        this.innerHTMLState.set(value)
    }
}
