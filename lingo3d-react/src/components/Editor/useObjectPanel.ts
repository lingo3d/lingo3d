import { forceGet } from "@lincode/utils"
import schema, { objectManagerProps, texturedBasicProps, texturedStandardProps, model, skyLight, areaLight, spotLight, pointLight, camera } from "lingo3d/lib/display/utils/deserialize/schema"
import { onTransformControls } from "lingo3d/lib/events/onTransformControls"
import React, { useLayoutEffect } from "react"
import { Pane } from "tweakpane"
import makeValue from "./makeValue"
import makeVectorValue, { programmaticChangePtr } from "./makeVectorValue"
import type { Camera as ThreeCamera } from "three"
import addCameraInput from "./addCameraInput"

type Config = Record<string, readonly [any, Record<string, any>?]>

export default (
    target: any,
    cam: ThreeCamera,
    camList: Array<ThreeCamera>,
    divRef: React.MutableRefObject<HTMLDivElement | null>,
    enabled: boolean
) => {
    useLayoutEffect(() => {
        const container = divRef.current
        const t = target
        
        if (!t || !container || !enabled) return

        const conf: Config = {
            "scale": makeValue(t, "scale", 1, "transform"),
            "scale parts": makeVectorValue(t, "scaleX", "scaleY", "scaleZ", "transform"),
            "position": makeVectorValue(t, "x", "y", "z", "transform"),
            "rotation": makeVectorValue(t, "rotationX", "rotationY", "rotationZ", "transform"),

            "size": makeVectorValue(t, "width", "height", "depth", "inner transform"),
            "inner position": makeVectorValue(t, "innerX", "innerY", "innerZ", "inner transform"),
            "inner rotation": makeVectorValue(t, "innerRotationX", "innerRotationY", "innerRotationZ", "inner transform"),

            "bloom": makeValue(t, "bloom", false, "display"),
            "reflection": makeValue(t, "reflection", false, "display"),
            "visible": makeValue(t, "visible", true, "display"),
        }
        //@ts-ignore
        const props = schema[t.constructor.componentName]
        if (props)
            for (const [name, value] of Object.entries(props)) {
                if (name in objectManagerProps) continue
                let folder = "misc"

                if (name in texturedBasicProps)
                    folder = "basic texture"
                else if (name in texturedStandardProps)
                    folder = "standard texture"
                else if (name in model)
                    folder = "loaded"
                else if (name in skyLight || name in areaLight || name in spotLight || name in pointLight)
                    folder = "light"
                else if (name in camera)
                    folder = "camera"

                conf[name] = makeValue(t, name, value, folder)
            }

        const params = Object.fromEntries(Object.entries(conf).map(([key, [value]]) => [key, value]))

        const pane = new Pane({ container })
        addCameraInput(pane, camList, cam)

        const folderMap = new Map<string, any>()
        for (const [key, [, options]] of Object.entries(conf)) {
            const { onChange, folder, ...o } = options ?? {}
            const parent = folder ? forceGet(folderMap, folder, () => pane.addFolder({ title: folder })) : pane
            const input = parent.addInput(params, key, o)
            input.on("change", onChange)
        }

        const handle = onTransformControls(() => {
            Object.assign(params, {
                "scale": t.scale,
                "scale parts": { x: t.scaleX, y: t.scaleY, z: t.scaleZ },
                "position": { x: t.x, y: t.y, z: t.z },
                "rotation": { x: t.rotationX, y: t.rotationY, z: t.rotationZ }
            })
            programmaticChangePtr[0] = true
            pane.refresh()
            programmaticChangePtr[0] = false
        })

        return () => {
            pane.dispose()
            handle.cancel()
        }
    }, [target, enabled, camList])
}