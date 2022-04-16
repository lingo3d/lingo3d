import React, { useContext, useLayoutEffect } from "react"
import { ParentContext } from "../../../hooks/useManager"
import { pull } from "lodash"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import render from "./render17"
import { elements } from "./build"

interface HTMLProps {
    parent?: any,
    children: React.ReactNode
}

const HTML: React.FC<HTMLProps> = ({ children }) => {
    const parent = useContext(ParentContext)

    useLayoutEffect(() => {
        if (!parent) return

        const pair: [React.ReactNode, ObjectManager] = [children, parent]

        elements.push(pair)
        render()

        return () => {
            pull(elements, pair)
            render()
        }
    }, [parent])

    return null
}

export default HTML