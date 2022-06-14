import { h } from "preact"
import { preventTreeShake } from "@lincode/utils"
import style from "./style"

preventTreeShake(h)

const Reticle = ({ color = "#000", size = 50, strokeWidth = 6 }) => {
    return (
        <svg
         viewBox="0 0 1300 1390"
         xmlns="http://www.w3.org/2000/svg"
         xmlSpace="preserve"
         style={{
            ...style,
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5,
            width: size,
            height: size
        }}>
            <path
             d="M271.634 164.535v98.922"
             style={{
                 fill: "none",
             }}
             transform="translate(-1012.86 -962.446) scale(6.11103)"
            />
            <circle
             cx={301.524}
             cy={315.101}
             r={107.813}
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.75 * strokeWidth,
             }}
             transform="matrix(5.51976 0 0 5.51976 -1017.236 -1043.75)"
            />
            <circle
             cx={301.524}
             cy={315.101}
             r={107.813}
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 1.56 * strokeWidth,
             }}
             transform="matrix(2.66727 0 0 2.66727 -157.145 -144.93)"
            />
            <circle
             cx={301.524}
             cy={315.101}
             r={107.813}
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 1.06 * strokeWidth,
             }}
             transform="translate(174.446 205.433) scale(1.56576)"
            />
            <circle
             cx={272.181}
             cy={266.334}
             r={7.08}
             transform="matrix(3.483 0 0 3.483 -300.907 -232.117)"
            />
            <path
             d="M271.634 164.535v98.922M279.824 271.309h98.648M271.634 279.887v98.022M263.267 271.309h-97.525M190.071 263.457v16.43M203.882 263.457v16.43"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.41 * strokeWidth,
             }}
             transform="translate(-1012.86 -962.446) scale(6.11103)"
            />
            <path
             d="M190.071 263.457v16.43M203.882 263.457v16.43"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.43 * strokeWidth,
             }}
             transform="matrix(6.11103 0 0 5.45744 -99.536 -783.825)"
            />
            <path
             d="M263.267 189.719h16.557"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.41 * strokeWidth,
             }}
             transform="translate(-1012.86 -962.446) scale(6.11103)"
            />
            <path
             d="M263.267 189.719h16.557"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.41 * strokeWidth,
             }}
             transform="translate(-1012.86 -876.832) scale(6.11103)"
            />
            <path
             d="M263.267 189.719h16.557"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.41 * strokeWidth,
             }}
             transform="translate(-1012.86 -50.748) scale(6.11103)"
            />
            <path
             d="M263.267 189.719h16.557"
             style={{
                 fill: "none",
                 stroke: color,
                 strokeWidth: 0.41 * strokeWidth,
             }}
             transform="translate(-1012.86 34.868) scale(6.11103)"
            />
        </svg>
    )
}

export default Reticle