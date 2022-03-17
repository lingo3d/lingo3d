import { setSkyShader } from "../states/useSkyShader"

export default class Sky {
    public static componentName = "sky"

    public constructor() {
        setSkyShader(true)
    }
}