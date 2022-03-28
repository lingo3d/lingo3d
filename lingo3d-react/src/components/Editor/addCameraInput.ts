import { Pane } from "tweakpane"
import { setCamera } from "lingo3d/lib/states/useCamera"
import type { Camera as ThreeCamera } from "three"

export default (pane: Pane, camList: Array<ThreeCamera>, cam: ThreeCamera) => {
    const cameraFolder = pane.addFolder({ title: "camera" })
    const cameraInput = pane.addInput({ "camera": camList.indexOf(cam) }, "camera", {
        options: camList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
    })
    cameraFolder.add(cameraInput)
    cameraInput.on("change", e => setCamera(camList[e.value]))
}