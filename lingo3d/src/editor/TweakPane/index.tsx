import { ComponentChildren, JSX } from "preact"
import { useEffect } from "preact/hooks"
import { Pane } from "./tweakpane"
import addInputs from "./addInputs"
import useInit from "./useInit"

type CustomEditorProps = {
    style?: React.CSSProperties
    className?: string
    children?: ComponentChildren
}

const CustomEditor = ({ children, style, className }: CustomEditorProps) => {
    const elRef = useInit()

    const _children: Array<JSX.Element> = Array.isArray(children)
        ? children
        : [children]

    useEffect(() => {
        const el = elRef.current
        if (!el || !_children.length) return

        const pane = new Pane({ container: el })

        const params = Object.fromEntries(
            _children
                .filter((child) => child!.props?.name)
                .map((child) => [
                    child!.props.name,
                    child!.props.values ? child!.props : child!.props.value
                ])
        )
        const onChange = Object.fromEntries(
            _children
                .filter((child) => child!.props?.name)
                .map((child) => [child!.props.name, child!.props.onChange])
        )
        addInputs(pane, "inputs", params, (name, value) =>
            onChange[name]?.(value)
        )

        return () => {
            pane.dispose()
        }
    }, [_children.length])

    return (
        <div
            ref={elRef}
            className={"lingo3d-ui " + (className ?? "")}
            style={{
                width: 300,
                background: "rgb(40, 41, 46)",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                ...style
            }}
        />
    )
}

export default CustomEditor
