import { ComponentChildren, createContext } from "preact"

export const TreeItemContext = createContext<{ draggingItem?: any }>({})

interface Props {
    children?: ComponentChildren
}

const TreeItemContextProvider = ({ children }: Props) => {
    return (
        <TreeItemContext.Provider value={{}}>
            {children}
        </TreeItemContext.Provider>
    )
}

export default TreeItemContextProvider
