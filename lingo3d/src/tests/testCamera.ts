import Cube from "../display/primitives/Cube";

let box = new Cube()

let reference = document.createElement("div")
Object.assign(reference.style, {
    width: "100px",
    height: "100px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    background: "rgba(255, 0, 0, 0.5)"
})
document.body.appendChild(reference)