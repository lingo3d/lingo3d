import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import CubeIcon from "./CubeIcon"

preventTreeShake(h)

const Library = () => {
    return (
        <div
         className="lingo3d-ui"
         style={{
             width: 200,
             height: "100%",
             background: "rgb(40, 41, 46)",
             padding: 10
         }}
        >
            <div style={{ display: "flex" }}>
                <CubeIcon />
                <CubeIcon />
            </div>
        </div>
    )
}

register(Library, "lingo3d-library")