import { Point } from "@lincode/math"

const mousePosition = new Point(0, 0)
export default mousePosition

document.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX
    mousePosition.y = e.clientY
})
