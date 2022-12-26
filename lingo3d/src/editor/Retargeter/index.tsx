import { EDITOR_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Joint from "./Joint"

const Retargeter = () => {
    useInitCSS()
    useInitEditor()

    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcenter"
            style={{ width: EDITOR_WIDTH }}
        >
            <div
                className="lingo3d-absfull"
                style={{
                    backgroundImage: "url(retargeter.png)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: 0.2,
                    transform: "translateX(3%)"
                }}
            />
            <div
                style={{
                    aspectRatio: "1 / 2.1",
                    width: "100%"
                }}
            >
                <Joint x={0} y={30} />

                <Joint x={-6} y={33} />
                <Joint x={6} y={33} />

                <Joint x={-14} y={34} />
                <Joint x={14} y={34} />

                <Joint x={-27} y={34} />
                <Joint x={27} y={34} />

                <Joint x={-41} y={34} />
                <Joint x={41} y={34} />

                <Joint x={0} y={35} />
                <Joint x={0} y={38.5} />
                <Joint x={0} y={43} />
                <Joint x={0} y={47} />

                <Joint x={-6} y={48} />
                <Joint x={6} y={48} />

                <Joint x={-5} y={59} />
                <Joint x={5} y={59} />

                <Joint x={-5} y={68} />
                <Joint x={5} y={68} />

                <Joint x={-6} y={72} />
                <Joint x={6} y={72} />
            </div>
        </div>
    )
}
export default Retargeter
