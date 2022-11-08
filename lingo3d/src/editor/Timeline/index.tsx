import register from "preact-custom-element"
import useInitCSS from "../utils/useInitCSS"

const Timeline = () => {
    useInitCSS(true)

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-panels"
            style={{
                height: 200,
                width: "100%",
                display: "flex"
            }}
        >
            <div style={{ overflow: "scroll", width: 200 }}></div>
            <div style={{ flexGrow: 1 }}>
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        overflow: "scroll",
                        position: "absolute"
                    }}
                ></div>
            </div>
        </div>
    )
}
export default Timeline

register(Timeline, "lingo3d-timeline")
