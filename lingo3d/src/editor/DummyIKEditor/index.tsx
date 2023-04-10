import { Point } from "@lincode/math"
import { useState } from "preact/hooks"
import { EDITOR_WIDTH, LIBRARY_WIDTH } from "../../globals"
import Tooltip from "../component/Tooltip"
import useInitCSS from "../hooks/useInitCSS"
import useInitEditor from "../hooks/useInitEditor"
import Joint from "./Joint"

const DummyIKEditor = () => {
    useInitCSS()
    useInitEditor()

    const [position, setPosition] = useState<Point>()

    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg lingo3d-editor lingo3d-flexcenter"
                style={{ width: EDITOR_WIDTH + LIBRARY_WIDTH }}
            >
                <div
                    style={{
                        aspectRatio: "1 / 2",
                        width: "100%"
                    }}
                >
                    <div
                        className="lingo3d-absfull"
                        style={{
                            backgroundImage: "url(retargeter.png)",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            opacity: 0.2
                        }}
                    />
                    <Joint
                        x={0}
                        y={30}
                        onMouseMove={(e) =>
                            setPosition({ x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setPosition(undefined)}
                    />

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
            <Tooltip position={position} />
        </>
    )
}
export default DummyIKEditor
