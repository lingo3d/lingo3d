import { System } from "../../../systems/utils/createInternalSystem"
import DeleteIcon from "../../FileBrowser/icons/DeleteIcon"
import MenuButton from "../../component/MenuButton"

type Props = {
    system: System
    onDelete?: () => void
    disabled?: boolean
}

const ListItem = ({ system, onDelete, disabled }: Props) => {
    return (
        <MenuButton
            key={system.name}
            compact
            padding={6}
            cursor="cursor"
            disabled={disabled}
        >
            <div
                style={{
                    cursor: disabled ? undefined : "pointer",
                    padding: 4,
                    margin: -4,
                    opacity: disabled ? 0.5 : 1
                }}
                onClick={disabled ? undefined : onDelete}
            >
                <DeleteIcon />
            </div>
            <div style={{ width: 6 }} />
            {system.name}
        </MenuButton>
    )
}

export default ListItem
