import { GameObjectType } from "../../api/serializer/types"
import ObjectIcon from "./ObjectIcon"

interface ObjectGroupProps {
    names: Array<GameObjectType | Partial<Record<GameObjectType, string>>>
}

const getIconName = (
    name: GameObjectType | Partial<Record<GameObjectType, string>>
) => {
    if (typeof name === "string") {
        if (name.endsWith("Camera")) return "camera"
        if (name.endsWith("Light")) return "light"
        return name
    }
    return Object.values(name)[0]
}

const getName = (
    name: GameObjectType | Partial<Record<GameObjectType, string>>
) => (typeof name === "string" ? name : Object.keys(name)[0])

const ObjectGroup = ({ names }: ObjectGroupProps) => {
    const groups: Array<
        Array<GameObjectType | Partial<Record<GameObjectType, string>>>
    > = []
    let latestGroup: Array<
        GameObjectType | Partial<Record<GameObjectType, string>>
    > = []

    let i = 0
    for (const name of names) {
        if (i === 0) groups.push((latestGroup = []))
        latestGroup.push(name)
        if (++i === 2) i = 0
    }

    return (
        <>
            {groups.map(([name0, name1], i) => (
                <div key={i} style={{ display: "flex" }}>
                    <ObjectIcon
                        name={getName(name0)}
                        iconName={getIconName(name0)}
                    />
                    {name1 && (
                        <ObjectIcon
                            name={getName(name1)}
                            iconName={getIconName(name1)}
                        />
                    )}
                </div>
            ))}
        </>
    )
}

export default ObjectGroup
