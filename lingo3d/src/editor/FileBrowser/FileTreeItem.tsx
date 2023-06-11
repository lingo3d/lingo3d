import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import useSyncState from "../hooks/useSyncState"
import {
    getFileBrowserDir,
    setFileBrowserDir
} from "../../states/useFileBrowserDir"
import FolderIcon from "./icons/FolderIcon"
import { useSignal } from "@preact/signals"
import { fileStructurePathMap } from "../../collections/fileStructurePathMap"
import { FileStructure } from "../../states/useFileStructure"

type FileTreeItemProps = {
    fileStructure: FileStructure
    rootFolderName: string
    folderName?: string
    myPath?: string
}

const FileTreeItem = ({
    fileStructure,
    rootFolderName,
    folderName,
    myPath
}: FileTreeItemProps) => {
    const fileBrowserDir = useSyncState(getFileBrowserDir)
    const expandedSignal = useSignal(true)

    const children = () =>
        Object.entries<any>(fileStructure).map(([name, fileOrFolder]) =>
            fileOrFolder instanceof File ? null : (
                <FileTreeItem
                    key={name}
                    fileStructure={fileOrFolder}
                    rootFolderName={rootFolderName}
                    folderName={name}
                    myPath={
                        rootFolderName + fileStructurePathMap.get(fileOrFolder)
                    }
                />
            )
        )
    if (!myPath) return <>{children()}</>

    return (
        <BaseTreeItem
            label={folderName}
            expandedSignal={expandedSignal}
            selected={myPath === fileBrowserDir}
            onClick={() => setFileBrowserDir(myPath)}
            IconComponent={FolderIcon}
        >
            {children}
        </BaseTreeItem>
    )
}

export default FileTreeItem
