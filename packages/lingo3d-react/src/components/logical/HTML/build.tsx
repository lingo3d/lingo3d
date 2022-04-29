import { forceGet } from "@lincode/utils"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { nanoid } from "nanoid"
import React from "react"
import HTMLChild from "./HTMLChild"

export const elements: Array<[React.ReactNode, ObjectManager]> = []

const managerIdMap = new WeakMap<ObjectManager, string>()

export const build = () => <>{elements.map(([el, manager]) =>
    <HTMLChild key={forceGet(managerIdMap, manager, nanoid)} el={el} manager={manager} />)}</>