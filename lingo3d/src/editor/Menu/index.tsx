import { Fragment, h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import MenuButton from "./MenuButton"
import ContextMenu from "../ContextMenu"
import MenuItem from "../ContextMenu/MenuItem"
import { useState } from "preact/hooks"

preventTreeShake(h)

type Data = {
    x: number
    y: number
    menuItems: Array<{ text: string; onClick?: () => void }>
}

const Menu = () => {
    const [data, setData] = useState<Data | undefined>()

    return (
        <Fragment>
            <div
                className="lingo3d-ui"
                style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: 25,
                    background: "rgb(35, 36, 41)",
                    marginTop: -20,
                    zIndex: 10,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}
            >
                <ul
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "start"
                    }}
                >
                    <MenuButton
                        onClick={(e) =>
                            setData({
                                x: e.left,
                                y: e.top,
                                menuItems: [
                                    {
                                        text: "first button",
                                        onClick: () =>
                                            console.log("first button clicked")
                                    },
                                    {
                                        text: "second button",
                                        onClick: () =>
                                            console.log("second button clicked")
                                    }
                                ]
                            })
                        }
                    >
                        File
                    </MenuButton>
                    <MenuButton>View</MenuButton>
                </ul>
            </div>
            <ContextMenu data={data}>
                {data?.menuItems.map((item) => (
                    <MenuItem onClick={item.onClick}>{item.text}</MenuItem>
                ))}
            </ContextMenu>
        </Fragment>
    )
}

register(Menu, "lingo3d-menu")
