import register from "preact-custom-element"
import CloseableTab from "../component/CloseableTab"
import AppBar from "../component/AppBar"
import useInitCSS from "../utils/useInitCSS"

const Panels = () => {
    useInitCSS(true)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <AppBar>
                <CloseableTab>timeline</CloseableTab>
                <CloseableTab>files</CloseableTab>
            </AppBar>
            <div style={{ flexGrow: 1 }}></div>
        </div>
    )
}
export default Panels

register(Panels, "lingo3d-panels")
