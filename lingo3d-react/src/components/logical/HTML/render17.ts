import { outline } from "lingo3d"
import { build } from "./build"
import ReactDOM from "react-dom"

export default () => {
    ReactDOM.render(build(), outline)
}