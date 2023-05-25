import MenuButton from "../component/MenuButton"

const MenuBar = () => {
    return (
        <div
            className="lingo3d-ui lingo3d-bg lingo3d-menubar"
            style={{ display: "flex", alignItems: "center", padding: 8 }}
        >
            <MenuButton compact>File</MenuButton>
            <MenuButton compact>Edit</MenuButton>
            <MenuButton compact>Selection</MenuButton>
            <MenuButton compact>View</MenuButton>
            <MenuButton compact>Help</MenuButton>
        </div>
    )
}

export default MenuBar
