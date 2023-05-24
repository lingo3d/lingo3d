import { useEffect, useMemo, useState } from "preact/hooks"
import Spinner from "../component/Spinner"
import { editorUrlPtr } from "../../pointers/assetsPathPointers"

type IconImageProps = {
    iconName: string
}

const ComponentIconImage = ({ iconName }: IconImageProps) => {
    const [loaded, setLoaded] = useState(false)
    const src = useMemo(() => `${editorUrlPtr[0]}${iconName}.png`, [iconName])

    useEffect(() => {
        const image = new Image()
        image.src = src
        image.onload = () => setLoaded(true)
    }, [])

    return (
        <div style={{ width: 50, height: 50 }}>
            {!loaded && (
                <div
                    className="lingo3d-flexcenter lingo3d-fadein"
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
export default ComponentIconImage
