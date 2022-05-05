import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import IconData from "./IconData"

preventTreeShake(h)

type ObjectIconProps = {
    name: string
}

const ObjectIcon = ({ name }: ObjectIconProps) => {
    return (
        <div style={{ width: "50%", padding: 20 }}>
            <img style={{ width: "100%" }} src={IconData} />
            <div style={{ textAlign: "center", marginTop: 6, opacity: 0.75 }}>
                {name}
            </div>
        </div>
    )
}

export default ObjectIcon