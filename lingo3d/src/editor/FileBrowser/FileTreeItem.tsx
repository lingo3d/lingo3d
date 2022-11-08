import { Fragment } from "preact"
import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import { useFileBrowserDir } from "../states"
import FolderIcon from "./icons/FolderIcon"
import pathMap from "./pathMap"

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
    const [fileBrowserDir, setFileBrowserDir] = useFileBrowserDir()

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
            selected={myPath === fileBrowserDir}
            onClick={() => setFileBrowserDir(myPath)}
            IconComponent={FolderIcon}
        >
            {children}
        </BaseTreeItem>
    )
}

export default FileTreeItem
