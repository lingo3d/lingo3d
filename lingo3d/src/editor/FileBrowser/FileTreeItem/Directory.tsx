import { preventTreeShake } from "@lincode/utils"
import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import pathMap from "../pathMap"

preventTreeShake(h)

type IconHolderProps = {
    fileOrFolder: any
    firstFolderName: string
    onClick: (path: string) => void
    name: string
    currentPath: string
}

export default function Directory({
    firstFolderName,
    fileOrFolder,
    onClick,
    name,
    currentPath
}: IconHolderProps) {
    const [hover, setHover] = useState(false)
    const [dirPath, setDirPath] = useState("")

    useEffect(() => {
        setDirPath(firstFolderName + pathMap.get(fileOrFolder))
    })

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => {
                e.stopPropagation()
                const path = firstFolderName + pathMap.get(fileOrFolder)
                onClick?.(path)
            }}
            style={{
                position: "relative",
                background:
                    dirPath === currentPath
                        ? "rgb(0,112,221)"
                        : hover
                        ? "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.2))"
                        : undefined
            }}
        >
            {name}
        </div>
    )
}
