import { useLayoutEffect } from "preact/hooks"
import { emitEditorLayout } from "../../events/onEditorLayout"
import createElement from "../../utils/createElement"

let initialized = false

const initCSS = () => {
    if (initialized) return
    initialized = true

    const style = createElement(`
        <style>
            .lingo3d-ui * {
                overscroll-behavior: none;
                user-select: none;
                -webkit-user-select: none;
                position: relative;
                box-sizing: border-box;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
                scrollbar-width: none;
                scrollbar-color: rgba(100,100,100,0.1);
            }
            .lingo3d-ui {
                overscroll-behavior: none;
                position: relative;
                box-sizing: border-box;
                overflow: hidden;
                float: left;
                color: white;
                font-size: 11px;
                max-height: 100%;
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
                background: rgb(18, 19, 22);
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
                grid-template-columns: auto auto auto auto 1fr;
                grid-template-rows: auto 1fr auto;
            }
            .lingo3d-scenegraph { grid-area: 1 / 2 / 3 / 3; }
            .lingo3d-editor { grid-area: 1 / 3 / 3 / 4; }
            .lingo3d-library { grid-area: 1 / 4 / 3 / 5; }
            .lingo3d-tabs { grid-area: 1 / 5 / 2 / 6; }
            .lingo3d-panels { grid-area: 3 / 2 / 4 / 5; }
            .lingo3d-toolbar { grid-area: 1 / 1 / 4 / 2; }
            .lingo3d-world { grid-area: 2 / 5 / 4 / 6; }

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
}

export default (editorLayout: boolean) => {
    useLayoutEffect(() => {
        initCSS()
        if (!editorLayout) return
        emitEditorLayout()
        return () => {
            emitEditorLayout()
        }
    }, [])
}
