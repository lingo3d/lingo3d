import { useEffect, useState } from "preact/hooks"

type TransitionProps = {
    children?: Function
    mounted?: boolean
    delay?: number
}

const Transition = ({ children, mounted, delay = 1000 }: TransitionProps) => {
    const [mountDelayed, setMountDelayed] = useState(mounted)

    useEffect(() => {
        if (mounted) {
            setMountDelayed(true)
            return
        }
        const timeout = setTimeout(() => setMountDelayed(false), delay)
        return () => {
            clearTimeout(timeout)
        }
    }, [mounted, delay])

    if (!mountDelayed) return null

    return children?.()
}

export default Transition
