import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import useSyncState from "../hooks/useSyncState"
import {
    getFileBrowserDir,
    setFileBrowserDir
} from "../../states/useFileBrowserDir"
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
    const fileBrowserDir = useSyncState(getFileBrowserDir)

    const children = () =>
        fileEntries.map(([name, fileOrFolder]) =>
            fileOrFolder instanceof File ? null : (
                <FileTreeItem
                    key={name}
                    fileStructure={fileOrFolder}
                    firstFolderName={firstFolderName}
                    folderName={name}
                    myPath={firstFolderName + pathMap.get(fileOrFolder)}
                />
            )
        )
    if (!myPath) return <>{children()}</>

    return (
        <BaseTreeItem
            label={folderName}
            expanded
            selected={myPath === fileBrowserDir}
            onClick={() => setFileBrowserDir(myPath)}
            IconComponent={FolderIcon}
        >
            {children}
        </BaseTreeItem>
    )
}

export default FileTreeItem
