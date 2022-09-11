import { preventTreeShake } from "@lincode/utils"
import { Fragment, h } from "preact"
import BaseTreeItem from "../component/BaseTreeItem"
import { useFileBrowserPath } from "../states"
import FolderIcon from "./icons/FolderIcon"
import pathMap from "./pathMap"

preventTreeShake(h)

type FileTreeItemProps = {
    fileStructure: any
    firstFolderName: string
    folderName?: string
    myPath?: string
}

const FileTreeItem = ({
    fileStructure,
    firstFolderName,
    folderName,
    myPath
}: FileTreeItemProps) => {
    const fileEntries = Object.entries<any>(fileStructure)
    const [fileBrowserPath, setFileBrowserPath] = useFileBrowserPath()

    const children = () =>
        fileEntries.map(([name, fileOrFolder]) =>
            fileOrFolder instanceof File ? null : (
                <FileTreeItem
                    fileStructure={fileOrFolder}
                    firstFolderName={firstFolderName}
                    folderName={name}
                    myPath={firstFolderName + pathMap.get(fileOrFolder)}
                />
            )
        )
    if (!myPath) return <Fragment>{children()}</Fragment>

    return (
        <BaseTreeItem
            label={folderName}
            expanded
            expandable
            selected={myPath === fileBrowserPath}
            onClick={() => setFileBrowserPath(myPath)}
            IconComponent={FolderIcon}
        >
            {children}
        </BaseTreeItem>
    )
}

export default FileTreeItem
