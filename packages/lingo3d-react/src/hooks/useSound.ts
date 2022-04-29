import { useMemoOnce } from "@lincode/hooks"
import { Sound } from "lingo3d"
import ISound from "lingo3d/lib/interface/ISound"
import { useLayoutEffect } from "react"

export default (src: string, options?: Omit<Partial<ISound>, "src">) => {
    const sound = useMemoOnce(() => new Sound(), sound => sound.dispose())

    useLayoutEffect(() => {
        if (sound.done) return

        sound.src = src
        options && Object.assign(sound, options)
    }, [src, options && JSON.stringify(options)])

    return sound
}