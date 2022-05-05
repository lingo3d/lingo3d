import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import CubeIcon from "./ObjectIcon"

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
                <CubeIcon name="Cube" />
                <CubeIcon name="Sphere" />
            </div>
            <div style={{ display: "flex" }}>
                <CubeIcon name="Cone" />
                <CubeIcon name="Cylinder" />
            </div>
            <div style={{ display: "flex" }}>
                <CubeIcon name="Octahedron" />
                <CubeIcon name="Tetrahedron" />
            </div>
            <div style={{ display: "flex" }}>
                <CubeIcon name="Torus" />
                <CubeIcon name="Plane" />
            </div>
            <div style={{ display: "flex" }}>
                <CubeIcon name="Circle" />
            </div>
        </div>
    )
}

register(Library, "lingo3d-library")