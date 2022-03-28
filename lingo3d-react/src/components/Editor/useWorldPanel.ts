import { useMemoOnce } from "@lincode/hooks"
import { forceGet } from "@lincode/utils"
import { applySetup } from "lingo3d"
import React, { useLayoutEffect } from "react"
import { Pane } from "tweakpane"
import makeValue from "./makeValue"
import type { Camera as ThreeCamera } from "three"
import addCameraInput from "./addCameraInput"

type Config = Record<string, readonly [any, Record<string, any>?]>

export default (
    cam: ThreeCamera,
    camList: Array<ThreeCamera>,
    divRef: React.MutableRefObject<HTMLDivElement | null>,
    enabled: boolean
) => {
    const t = useMemoOnce(() => ({}))

    useLayoutEffect(() => {
        const container = divRef.current
        if (!container || !enabled) return

        const conf: Config = {
            "gridHelper": makeValue(t, "gridHelper", true, "visualize"),
            "cameraHelper": makeValue(t, "cameraHelper", true, "visualize"),
            "lightHelper": makeValue(t, "lightHelper", true, "visualize"),
            "defaultFog": makeValue(t, "defaultFog", false, "scene"),
            "defaultLight": makeValue(t, "defaultLight", true, "scene"),
            "bloom": makeValue(t, "bloom", false, "rendering"),
            "bloomStrength": makeValue(t, "bloomStrength", 1.5, "rendering"),
            "bloomRadius": makeValue(t, "bloomRadius", 0, "rendering"),
            "bloomThreshold": makeValue(t, "bloomThreshold", 0, "rendering"),
            "ambientOcclusion": makeValue(t, "ambientOcclusion", false, "rendering"),
            "texture": makeValue(t, "texture", "", "background"),
            "color": makeValue(t, "color", "#000000", "background"),
        }

        const params = Object.fromEntries(Object.entries(conf).map(([key, [value]]) => [key, value]))

        const pane = new Pane({ container })
        addCameraInput(pane, camList, cam)

        const folderMap = new Map<string, any>()
        for (const [key, [, options]] of Object.entries(conf)) {
            const { onChange, folder, ...o } = options ?? {}
            const parent = folder ? forceGet(folderMap, folder, () => pane.addFolder({ title: folder })) : pane
            const input = parent.addInput(params, key, o)
            input.on("change", (e: any) => {
                onChange(e)
                applySetup(t)
            })
        }

        return () => {
            pane.dispose()
        }
    }, [enabled, camList])
}