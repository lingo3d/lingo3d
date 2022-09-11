import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import Directory from "./Directory"

preventTreeShake(h)

type FileTreeItemProps = {
    fileStructure: any
    firstFolderName: string
    onClick: (path: string) => void
    currentPath: string
}

const FileTreeItem = ({
    fileStructure,
    firstFolderName,
    onClick,
    currentPath
}: FileTreeItemProps) => {
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
