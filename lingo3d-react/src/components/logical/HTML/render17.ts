import { outline } from "lingo3d"

export default async (target: any) => {
    const ReactDOM = (await import("react-dom")).default
    ReactDOM.render(target, outline)
}