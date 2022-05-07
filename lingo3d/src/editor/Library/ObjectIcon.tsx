import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"

preventTreeShake(h)

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name.toLowerCase() }: ObjectIconProps) => {
    return (
        <div style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
        }}>
            <img style={{ width: 50 }} src={`https://www.lingo3d.com/icons/${iconName}.png`} />
            <div style={{ marginTop: 6, opacity: 0.75, overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                {name}
            </div>
        </div>
    )
}

export default ObjectIcon