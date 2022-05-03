import "./Editor"
import "./SceneGraph"

const style = document.createElement("style")
document.head.appendChild(style)
style.innerHTML =
`.lingo3d-ui * {
    user-select: none;
    -webkit-user-select: none;
}`