import { preventTreeShake } from "@lincode/utils"
import { h, Fragment } from "preact"
import { GameObjectType } from "../../display/utils/deserialize/types"
import ObjectIcon from "./ObjectIcon"

preventTreeShake(h)

interface ObjectGroupProps {
    names: Array<GameObjectType>
}

const mapIconName = (name: string) => {
    if (name.endsWith("Camera")) return "camera"
    if (name.endsWith("Light")) return "light"
}

const ObjectGroup = ({ names }: ObjectGroupProps) => {
    const groups: Array<Array<string>> = []
    let latestGroup: Array<string> = []

    let i = 0
    for (const name of names) {
        if (i === 0) groups.push(latestGroup = [])
        latestGroup.push(name)
        if (++i === 2) i = 0
    }

    return (
        <Fragment>{groups.map(([name0, name1], i) => (
            <div key={i} style={{ display: "flex" }}>
                <ObjectIcon name={name0} iconName={mapIconName(name0)} />
                {name1 && <ObjectIcon name={name1} iconName={mapIconName(name1)} />}
            </div>
        ))}</Fragment>
    )
}

export default ObjectGroup
