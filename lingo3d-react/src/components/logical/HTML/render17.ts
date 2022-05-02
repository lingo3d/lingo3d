import { build } from "./build"
import ReactDOM from "react-dom"
import { htmlContainer } from "../../World"

export default () => {
    ReactDOM.render(build(), htmlContainer)
}