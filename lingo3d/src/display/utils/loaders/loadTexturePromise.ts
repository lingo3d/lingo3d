import { Texture } from "three"
import { forceGet } from "@lincode/utils"
import loadTexture from "./loadTexture"

const cache = new Map<string, Promise<Texture>>()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () => new Promise<Texture>((resolve) => loadTexture(url, resolve))
    )
