import MenuButton from "../component/MenuButton"
import MenuBarEditContextMenu, {
    menuBarEditContextMenuSignal
} from "./MenuBarEditContextMenu"
import MenuBarFileContextMenu, {
    menuBarFileContextMenuSignal
} from "./MenuBarFileContextMenu"
import MenuBarHelpContextMenu, {
    menuBarHelpContextMenuSignal
} from "./MenuBarHelpContextMenu"
import MenuBarSelectionContextMenu, {
    menuBarSelectionContextMenuSignal
} from "./MenuBarSelectionContextMenu"
import MenuBarViewContextMenu, {
    menuBarViewContextMenuSignal
} from "./MenuBarViewContextMenu"

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
                <MenuButton
                    compact
                    activeSignal={menuBarEditContextMenuSignal}
                    onClick={(e) =>
                        (menuBarEditContextMenuSignal.value =
                            getMenuSnappingPoint(e))
                    }
                >
                    Edit
                </MenuButton>
                <MenuButton
                    compact
                    activeSignal={menuBarSelectionContextMenuSignal}
                    onClick={(e) =>
                        (menuBarSelectionContextMenuSignal.value =
                            getMenuSnappingPoint(e))
                    }
                >
                    Selection
                </MenuButton>
                <MenuButton
                    compact
                    activeSignal={menuBarViewContextMenuSignal}
                    onClick={(e) =>
                        (menuBarViewContextMenuSignal.value =
                            getMenuSnappingPoint(e))
                    }
                >
                    View
                </MenuButton>
                <MenuButton
                    compact
                    activeSignal={menuBarHelpContextMenuSignal}
                    onClick={(e) =>
                        (menuBarHelpContextMenuSignal.value =
                            getMenuSnappingPoint(e))
                    }
                >
                    Help
                </MenuButton>
            </div>
            <MenuBarFileContextMenu />
            <MenuBarEditContextMenu />
            <MenuBarSelectionContextMenu />
            <MenuBarViewContextMenu />
            <MenuBarHelpContextMenu />
        </>
    )
}

export default MenuBar
