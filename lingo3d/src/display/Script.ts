import IScript from "../interface/IScript"
import Appendable from "./core/Appendable"

export default class Script extends Appendable implements IScript {
    public code = ""
}
