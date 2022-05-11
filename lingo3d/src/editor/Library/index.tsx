import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import ObjectIcon from "./ObjectIcon"

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
                <ObjectIcon name="model" />
                <ObjectIcon name="svgMesh" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="reflector" />
                <ObjectIcon name="cube" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="sphere" />
                <ObjectIcon name="cone" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="cylinder" />
                <ObjectIcon name="octahedron" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="tetrahedron" />
                <ObjectIcon name="torus" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="plane" />
                <ObjectIcon name="circle" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="ambientLight" iconName="light" />
                <ObjectIcon name="areaLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="directionalLight" iconName="light" />
                <ObjectIcon name="skyLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="pointLight" iconName="light" />
                <ObjectIcon name="spotLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="camera" iconName="camera" />
                <ObjectIcon name="thirdPersonCamera" iconName="camera" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="firstPersonCamera" iconName="camera" />
                <ObjectIcon name="orbitCamera" iconName="camera" />
            </div>
        </div>
    )
}

register(Library, "lingo3d-library")