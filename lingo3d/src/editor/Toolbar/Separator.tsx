import { preventTreeShake } from "@lincode/utils";
import { h } from "preact";

preventTreeShake(h)

const Separator = () => {
    return (
        <div style={{ width: "60%", height: 2, background: "rgba(255, 255, 255, 0.1)", margin: 12 }} />
    )
}

export default Separator