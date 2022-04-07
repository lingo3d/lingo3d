import React, { useContext, useLayoutEffect } from "react"
import { ParentContext } from "../../../hooks/useManager"
import { pull } from "lodash"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { forceGet } from "@lincode/utils"
import { nanoid } from "nanoid"
import HTMLChild from "./HTMLChild"
import render from "./render17"

interface HTMLProps {
    parent?: any
}

const elements: Array<[React.ReactNode, ObjectManager]> = []

const managerIdMap = new WeakMap<ObjectManager, string>()

const build = () => <>{elements.map(([el, manager]) =>
    <HTMLChild key={forceGet(managerIdMap, manager, nanoid)} el={el} manager={manager} />)}</>

const HTML: React.FC<HTMLProps> = ({ children }) => {
    const parent = useContext(ParentContext)

    useLayoutEffect(() => {
        if (!parent) return

        const pair: [React.ReactNode, ObjectManager] = [children, parent]

        elements.push(pair)
        render(build())

        return () => {
            pull(elements, pair)
            render(build())
        }
    }, [])

    return null
}

export default HTML