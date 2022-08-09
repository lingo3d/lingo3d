import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import CloseIcon from "./icons/CloseIcon"

preventTreeShake(h)

const FileBrowser = () => {
    return (
        <div
            className="lingo3d-ui lingo3d-bg"
            style={{ height: 200, width: "100%" }}
        >
            <div
                style={{
                    width: "100%",
                    height: 25,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex"
                }}
            >
                <div
                    className="lingo3d-bg"
                    style={{
                        height: "100%",
                        display: "flex",
                        paddingLeft: 20,
                        paddingRight: 20,
                        alignItems: "center"
                    }}
                >
                    hello world
                    <div style={{ width: 20 }} />
                    <div onClick={() => console.log("here")}>
                        <CloseIcon />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FileBrowser

register(FileBrowser, "lingo3d-filebrowser")
