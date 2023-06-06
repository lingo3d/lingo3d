import { System } from "../../../systems/utils/createInternalSystem"
import DeleteIcon from "../../FileBrowser/icons/DeleteIcon"
import MenuButton from "../../component/MenuButton"

type Props = {
    system: System<any, any>
    onDelete?: () => void
}

const ListItem = ({ system, onDelete }: Props) => {
    return (
        <MenuButton key={system.name} compact padding={6} cursor="cursor">
            <div
                style={{
                    cursor: "pointer",
                    padding: 4,
                    margin: -4
                }}
                onClick={onDelete}
            >
                <DeleteIcon />
            </div>
            <div style={{ width: 6 }} />
            {system.name}
        </MenuButton>
    )
}

export default ListItem
