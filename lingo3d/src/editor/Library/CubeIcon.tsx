import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import IconData from "./IconData"

preventTreeShake(h)

const CubeIcon = () => {
    return (
        <div style={{ width: "50%", padding: 10 }}>
            <img style={{ width: "100%" }} src={IconData} />
            <div style={{ textAlign: "center" }}>Cube</div>
        </div>
    )
}

export default CubeIcon