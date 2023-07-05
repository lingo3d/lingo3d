import { useEffect, useState } from "preact/hooks"
import IconButton from "./IconButton"

type Props = {
    choices?: Array<string>
}

const Segments = ({ choices }: Props) => {
    const [selected, setSelected] = useState("")

    useEffect(() => {
        setSelected(choices?.[0] ?? "")
    }, [choices])

    return (
        <div style={{ display: "flex" }}>
            {choices?.map((choice) => (
                <IconButton
                    fill={selected === choice}
                    label={choice}
                    onClick={() => setSelected(choice)}
                />
            ))}
        </div>
    )
}

export default Segments
