import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import ObjectIcon from "./ObjectIcon"
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
                "svgMesh",
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
            <ObjectIcon name="trigger" iconName="cube" />
        </div>
    )
}

register(Library, "lingo3d-library")