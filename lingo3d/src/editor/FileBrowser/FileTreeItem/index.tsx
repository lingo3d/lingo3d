import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import Directory from "./Directory"

preventTreeShake(h)

type IconHolderProps = {
    fileStructure: any
    firstFolderName: string
    onClick: (path: string) => void
    currentPath: string
}

function FileTreeItem({
    fileStructure,
    firstFolderName,
    onClick,
    currentPath
}: IconHolderProps) {
    const fileEntries = Object.entries(fileStructure)

    return (
        <div style={{ paddingLeft: 10, width: "100%" }}>
            {fileEntries.map(([name, fileOrFolder]) =>
                fileOrFolder instanceof File ? null : (
                    <Fragment>
                        <Directory
                            currentPath={currentPath}
                            firstFolderName={firstFolderName}
                            fileOrFolder={fileOrFolder}
                            onClick={onClick}
                            name={name}
                        />
                        <FileTreeItem
                            fileStructure={fileOrFolder}
                            firstFolderName={firstFolderName}
                            onClick={onClick}
                            currentPath={currentPath}
                        />
                    </Fragment>
                )
            )}
        </div>
    )
}

export default FileTreeItem
