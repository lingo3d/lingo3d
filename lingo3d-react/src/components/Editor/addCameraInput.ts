import { Pane } from "tweakpane"
import { Camera as GameCamera } from "lingo3d"
import { setCamera } from "lingo3d/lib/states/useCamera"

export default (pane: Pane, camList: Array<GameCamera>, cam: GameCamera) => {
    const cameraFolder = pane.addFolder({ title: "camera" })
    const cameraInput = pane.addInput({ "camera": camList.indexOf(cam) }, "camera", {
        options: camList.reduce<Record<string, any>>((acc, _, i) => (acc["camera " + i] = i, acc), {})
    })
    cameraFolder.add(cameraInput)
    cameraInput.on("change", e => setCamera(camList[e.value]))
}