import register from "preact-custom-element"
import CloseableTab from "../component/CloseableTab"
import AppBar from "../component/AppBar"
import useInitCSS from "../utils/useInitCSS"

const Timeline = () => {
    useInitCSS(true)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gridTemplateRows: "28px 1fr",
                gridColumnGap: "0px",
                gridRowGap: "0px"
            }}
        >
            <div style={{ gridArea: "1 / 1 / 2 / 3", display: "flex" }}>
                <AppBar>
                    <CloseableTab>Timeline</CloseableTab>
                </AppBar>
            </div>
            <div
                style={{ gridArea: "2 / 1 / 3 / 2", overflow: "scroll" }}
            ></div>
            <div style={{ gridArea: "2 / 2 / 3 / 3" }}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "scroll",
                        display: "flex",
                        flexWrap: "wrap",
                        position: "absolute"
                    }}
                ></div>
            </div>
        </div>
    )
}
export default Timeline

register(Timeline, "lingo3d-timeline")
