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
                <ObjectIcon name="Model" />
                <ObjectIcon name="Cube" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="Sphere" />
                <ObjectIcon name="Cone" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="Cylinder" />
                <ObjectIcon name="Octahedron" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="Tetrahedron" />
                <ObjectIcon name="Torus" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="Plane" />
                <ObjectIcon name="Circle" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="AmbientLight" iconName="light" />
                <ObjectIcon name="AreaLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="DirectionalLight" iconName="light" />
                <ObjectIcon name="SkyLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="PointLight" iconName="light" />
                <ObjectIcon name="SpotLight" iconName="light" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="Camera" iconName="camera" />
                <ObjectIcon name="ThirdPersonCamera" iconName="camera" />
            </div>
            <div style={{ display: "flex" }}>
                <ObjectIcon name="FirstPersonCamera" iconName="camera" />
                <ObjectIcon name="OrbitCamera" iconName="camera" />
            </div>
        </div>
    )
}

register(Library, "lingo3d-library")