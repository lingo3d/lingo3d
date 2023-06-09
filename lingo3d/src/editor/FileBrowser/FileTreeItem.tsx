import BaseTreeItem from "../component/treeItems/BaseTreeItem"
import useSyncState from "../hooks/useSyncState"
import {
    getFileBrowserDir,
    setFileBrowserDir
} from "../../states/useFileBrowserDir"
import FolderIcon from "./icons/FolderIcon"
import { useMemo } from "preact/hooks"
import { pathObjMap } from "../../collections/pathCollections"
import { firstFolderNamePtr } from "../../pointers/firstFolderNamePtr"
import { useSignal } from "@preact/signals"

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
    const fileEntries = useMemo(
        () => Object.entries<any>(fileStructure),
        [Object.keys(fileStructure).length]
    )
    const fileBrowserDir = useSyncState(getFileBrowserDir)
    const expandedSignal = useSignal(true)

    const children = () =>
        fileEntries.map(([name, fileOrFolder]) =>
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
