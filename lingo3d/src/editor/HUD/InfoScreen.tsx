import { ComponentChildren } from "preact"
import { CSSProperties } from "preact/compat"
import Transition from "../component/Transition"

interface InfoScreen {
    mounted?: boolean
    style?: CSSProperties
    children?: ComponentChildren
}

export default ({ mounted, style, children }: InfoScreen) => {
    return (
        <Transition mounted={mounted}>
            {() => (
                <div
                    className={mounted ? undefined : "lingo3d-fadeOut"}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        ...style
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                            background: "rgba(0, 0, 0, 0.5)",
                            padding: 2
                        }}
                    >
                        {children}
                    </div>
                </div>
            )}
        </Transition>
    )
}
