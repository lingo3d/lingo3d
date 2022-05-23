import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import ObjectGroup from "./ObjectGroup"

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
            <ObjectGroup names={[
                "model",
                "dummy",
                "svgMesh",
                "trigger",
                "reflector",
                "cube",
                "sphere",
                "cone",
                "cylinder",
                "octahedron",
                "tetrahedron",
                "torus",
                "plane",
                "circle",
                "areaLight",
                "boxLight",
                "ambientLight",
                "skyLight",
                "directionalLight",
                "pointLight",
                "spotLight",
                "camera",
                "thirdPersonCamera",
                "firstPersonCamera",
                "orbitCamera"
            ]} />
        </div>
    )
}

register(Library, "lingo3d-library")