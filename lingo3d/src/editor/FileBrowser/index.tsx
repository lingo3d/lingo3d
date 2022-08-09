import { h } from "preact"
import { useState } from "preact/hooks"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"
import CloseIcon from "./icons/CloseIcon"
import { useFiles } from "../states"
import FolderIcon from "./icons/FolderIcon"
import IconHolder from "./IconHolder"

preventTreeShake(h)

const FileBrowser = () => {
    const [files] = useFiles()
    const [hover, setHover] = useState(false)

    return (
        <div
            className="lingo3d-ui lingo3d-bg"
            style={{
                height: 200,
                width: "100%",
                maxWidth: "700px",
                overflow: "hidden"
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: 25,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    position: "fixed"
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
                    File Browser
                    <div style={{ width: 20 }} />
                    <div onClick={() => console.log("here")}>
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "scroll",
                    marginTop: 20,
                    padding: 10,
                    display: "flex",
                    flexWrap: "wrap"
                }}
            >
                {files?.map((file) => (
                    <IconHolder>
                        <FolderIcon />
                    </IconHolder>
                ))}
            </div>
        </div>
    )
}
export default FileBrowser

register(FileBrowser, "lingo3d-filebrowser")
