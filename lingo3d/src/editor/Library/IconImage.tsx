import { useEffect, useMemo, useState } from "preact/hooks"
import { EDITOR_URL } from "../../globals"
import Spinner from "../component/Spinner"

type IconImageProps = {
    iconName: string
}

const IconImage = ({ iconName }: IconImageProps) => {
    const [loaded, setLoaded] = useState(false)
    const src = useMemo(() => `${EDITOR_URL}${iconName}.png`, [iconName])

    useEffect(() => {
        const image = new Image()
        image.src = src
        image.onload = () => setLoaded(true)
    }, [])

    return (
        <div style={{ width: 50, height: 50 }}>
            {!loaded && (
                <div
                    className="lingo3d-flexcenter"
                    style={{ width: "100%", height: "100%" }}
                >
                    <Spinner color="rgba(255, 255, 255, 0.1)" />
                </div>
            )}
            {loaded && (
                <div
                    className="lingo3d-fadein"
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${src})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                />
            )}
        </div>
    )
}
export default IconImage
