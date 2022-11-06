import { useEffect } from "preact/hooks"
import { setEditorMode } from "../../states/useEditorMode"
import IconButton, { IconButtonProps } from "./IconButton"

type TransformButtonProps = IconButtonProps & {
    translateOnly?: boolean
    selectOnly?: boolean
}

const TransformButton = ({
    children,
    onClick,
    active,
    disabled,
    translateOnly,
    selectOnly
}: TransformButtonProps) => {
    useEffect(() => {
        if (disabled && active) {
            if (selectOnly) setEditorMode("select")
            else if (translateOnly) setEditorMode("translate")
        }
    }, [translateOnly, selectOnly])

    return (
        <IconButton onClick={onClick} active={active} disabled={disabled}>
            {children}
        </IconButton>
    )
}

export default TransformButton
