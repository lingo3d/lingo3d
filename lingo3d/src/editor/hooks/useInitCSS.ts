import { lazy } from "@lincode/utils"
import { APPBAR_HEIGHT, BACKGROUND_COLOR } from "../../globals"
import createElement from "../../utils/createElement"

const fontFamily = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`

const fix = `position: relative; box-sizing: border-box;`
const ui = `overscroll-behavior: none; user-select: none; -webkit-user-select: none; scrollbar-width: none; scrollbar-color: rgba(100,100,100,0.1);`

export default lazy(() => {
    const style = createElement(`
        <style>
            .lingo3d-ui * {
                ${fix}
                ${ui}
            }
            .lingo3d-ui-nofix * {
                ${ui}
            }
            .lingo3d-font * {
                font-family: ${fontFamily} !important;
            }
            .lingo3d-ui {
                ${fix}
                ${ui}
                overflow: hidden;
                float: left;
                color: white;
                font-size: 11px;
                max-height: 100%;
                font-family: ${fontFamily};
            }
            .lingo3d-ui *::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            .lingo3d-ui *::-webkit-scrollbar-thumb {
                background: rgba(100,100,100,0.7);
            }
            .lingo3d-ui *::-webkit-scrollbar-track {
                background: rgba(100,100,100,0.1);
            }
            .lingo3d-ui *::-webkit-scrollbar-corner {
                background: rgba(100,100,100,0.1);
            }

            .lingo3d-bg {
                background: ${BACKGROUND_COLOR};
            }
            .lingo3d-bg-dark {
                background: ${BACKGROUND_COLOR};
            }
            .lingo3d-absfull {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
            }
            .lingo3d-flexcenter {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .lingo3d-flexcol {
                display: flex;
                flex-direction: column;
            }
            .lingo3d-unset {
                all: unset;
            }

            .tp-lblv_l {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .tp-rotv {
                box-shadow: none !important;
                background-color: transparent !important;
            }
            .tp-brkv {
                border-left: none !important;
            }
            .tp-fldv_b {
                border-radius: 0px !important;
            }

            .lingo3d-lingoeditor {
                display: grid;
                grid-template: "menubar menubar    menubar menubar tabs"
                               "toolbar scenegraph editor library world"
                               "toolbar scenegraph editor library world"
                               "toolbar panels     panels panels  world";
                grid-template-columns: auto auto auto auto 1fr;
                grid-template-rows: ${APPBAR_HEIGHT + 8}px auto 1fr auto;
            }
            .lingo3d-scenegraph { grid-area: scenegraph; }
            .lingo3d-editor { grid-area: editor; }
            .lingo3d-library { grid-area: library; }
            .lingo3d-tabs { grid-area: tabs; }
            .lingo3d-panels { grid-area: panels; }
            .lingo3d-toolbar { grid-area: toolbar; }
            .lingo3d-world { grid-area: world; }
            .lingo3d-menubar { grid-area: menubar; }

            .lingo3d-body {
                overscroll-behavior: none;
            }

            .lingo3d-connector {
                width: 14px;
                height: 14px;
                margin-left: 2px;
                margin-right: 2px;
                flex-shrink: 0;
                z-index: 1;
                cursor: pointer;
                z-index: 1;
            }

            .lingo3d-connector-child {
                width: 4px;
                height: 4px;
                pointer-events: none;
            }

            .lingo3d-sk-cube-grid {
                width: 20px;
                height: 20px;
            }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube {
                width: 33%;
                height: 33%;
                background-color: currentColor;
                float: left;
                -webkit-animation: lingo3d-sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
                        animation: lingo3d-sk-cubeGridScaleDelay 1.3s infinite ease-in-out; 
            }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube1 {
                -webkit-animation-delay: 0.2s;
                        animation-delay: 0.2s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube2 {
                -webkit-animation-delay: 0.3s;
                        animation-delay: 0.3s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube3 {
                -webkit-animation-delay: 0.4s;
                        animation-delay: 0.4s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube4 {
                -webkit-animation-delay: 0.1s;
                        animation-delay: 0.1s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube5 {
                -webkit-animation-delay: 0.2s;
                        animation-delay: 0.2s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube6 {
                -webkit-animation-delay: 0.3s;
                        animation-delay: 0.3s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube7 {
                -webkit-animation-delay: 0s;
                        animation-delay: 0s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube8 {
                -webkit-animation-delay: 0.1s;
                        animation-delay: 0.1s; }
            .lingo3d-sk-cube-grid .lingo3d-sk-cube9 {
                -webkit-animation-delay: 0.2s;
                        animation-delay: 0.2s; }
            
            @-webkit-keyframes lingo3d-sk-cubeGridScaleDelay {
                0%, 70%, 100% {
                -webkit-transform: scale3D(1, 1, 1);
                        transform: scale3D(1, 1, 1);
                } 35% {
                -webkit-transform: scale3D(0, 0, 1);
                        transform: scale3D(0, 0, 1); 
                }
            }
            @keyframes lingo3d-sk-cubeGridScaleDelay {
                0%, 70%, 100% {
                -webkit-transform: scale3D(1, 1, 1);
                        transform: scale3D(1, 1, 1);
                } 35% {
                -webkit-transform: scale3D(0, 0, 1);
                        transform: scale3D(0, 0, 1);
                } 
            }
            
            .lingo3d-fadein {
                animation: fadeIn 1s;
            }
            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            .lingo3d-fadeOut {
                animation: fadeOut 1s;
            }
            @keyframes fadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
        </style>
    `)
    document.head.appendChild(style)
})
