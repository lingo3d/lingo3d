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
                scrollbar-width: thin;
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

            .lingo3d-sk-cube-grid {
                width: 20px;
                height: 20px;
                margin: 100px auto;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
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
