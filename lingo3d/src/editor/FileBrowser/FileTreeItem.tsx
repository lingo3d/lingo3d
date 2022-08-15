import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import pathMap from "./pathMap"

preventTreeShake(h)

type IconHolderProps = {
    fileStructure: any
    firstFolderName: string
    onClick: (path: string) => void
}

function FileTreeItem({
    fileStructure,
    firstFolderName,
    onClick
}: IconHolderProps) {
    const fileEntries = Object.entries(fileStructure)

    return (
        <div style={{ paddingLeft: 10 }}>
            {fileEntries.map(([name, fileOrFolder]) =>
                fileOrFolder instanceof File ? null : (
                    <Fragment>
                        <div
                            onClick={(e) => {
                                e.stopPropagation()
                                const path =
                                    firstFolderName + pathMap.get(fileOrFolder)
                                onClick?.(path)
                            }}
                        >
                            {name}
                        </div>
                        <FileTreeItem
                            fileStructure={fileOrFolder}
                            firstFolderName={firstFolderName}
                            onClick={onClick}
                        />
                    </Fragment>
                )
            )}
        </div>
    )
}

export default FileTreeItem
