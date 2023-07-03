import { Texture } from "three"
import { forceGet } from "@lincode/utils"
import loadTexture from "./loadTexture"
import { createMap } from "../../../utils/createCollection"

const cache = createMap<string, Promise<Texture>>()

export default (url: string) =>
    forceGet(
        cache,
        url,
        () => new Promise<Texture>((resolve) => loadTexture(url, resolve))
    )
