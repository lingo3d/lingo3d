import MenuButton from "../component/MenuButton"
import MenuBarFileContextMenu, {
    menuBarFileContextMenuSignal
} from "./MenuBarFileContextMenu"

const getMenuSnappingPoint = (e: MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    return { x: rect.left, y: rect.bottom }
}

const MenuBar = () => {
    return (
        <>
            <div
                className="lingo3d-ui lingo3d-bg-dark lingo3d-menubar"
                style={{ display: "flex", alignItems: "center", padding: 8 }}
            >
                <MenuButton
                    compact
                    activeSignal={menuBarFileContextMenuSignal}
                    onClick={(e) =>
                        (menuBarFileContextMenuSignal.value =
                            getMenuSnappingPoint(e))
                    }
                >
                    File
                </MenuButton>
                <MenuButton compact>Edit</MenuButton>
                <MenuButton compact>Selection</MenuButton>
                <MenuButton compact>View</MenuButton>
                <MenuButton compact>Help</MenuButton>
            </div>
            <MenuBarFileContextMenu />
        </>
    )
}

export default MenuBar
