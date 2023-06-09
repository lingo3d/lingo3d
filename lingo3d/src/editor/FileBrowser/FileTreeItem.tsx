import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import useSyncState from "../hooks/useSyncState"
import {
    getFileBrowserDir,
    setFileBrowserDir
} from "../../states/useFileBrowserDir"
import FolderIcon from "./icons/FolderIcon"
import { firstFolderNamePtr } from "../../pointers/firstFolderNamePtr"
import { useSignal } from "@preact/signals"
import { pathObjMap } from "../../collections/pathObjMap"

type FileTreeItemProps = {
    fileStructure: any
    folderName?: string
    myPath?: string
}

const FileTreeItem = ({
    fileStructure,
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
                    folderName={name}
                    myPath={
                        firstFolderNamePtr[0] + pathObjMap.get(fileOrFolder)
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
