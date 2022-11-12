import register from "preact-custom-element"
import useInitCSS from "../utils/useInitCSS"
import Ruler from "./Ruler"

const Timeline = () => {
    useInitCSS(true)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200 - 28,
                width: "100%",
                display: "flex"
            }}
        >
            <div style={{ overflow: "scroll", width: 200 }}></div>
            <div style={{ flexGrow: 1 }}>
                <div className="lingo3d-absfull">
                    <Ruler />
                </div>
            </div>
        </div>
    )
}
export default Timeline

register(Timeline, "lingo3d-timeline")
