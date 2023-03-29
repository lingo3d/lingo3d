import createElement from "../../utils/createElement"

const style = createElement(`
    <style>
        .lingo3d-container {
            position: absolute !important;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
        }
        .lingo3d-uicontainer {
            pointer-events: none;
        }
        .lingo3d-uicontainer > * {
            pointer-events: auto;
        }
    </style>
`)
document.head.appendChild(style)

export const container = createElement<HTMLDivElement>(
    `<div class="lingo3d-container"></div>`
)
export const uiContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container lingo3d-uicontainer"></div>`
)
export const overlayContainer = createElement<HTMLDivElement>(
    `<div class="lingo3d-container lingo3d-uicontainer"></div>`
)
