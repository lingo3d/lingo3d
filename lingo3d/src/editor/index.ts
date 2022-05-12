import "./Editor"
import "./SceneGraph"
import "./Toolbar"
import "./Library"

const style = document.createElement("style")
document.head.appendChild(style)
style.innerHTML =
`.lingo3d-ui * {
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    box-sizing: border-box;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
.lingo3d-ui {
    position: relative;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
    float: left;
    color: white;
    font-size: 11px;
}

.lingo3d-ui::-webkit-scrollbar {
    display: none;
}

.tp-rotv {
    box-shadow: none !important;
    background-color: transparent !important;
}
.tp-brkv {
    border-left: none !important;
}
`