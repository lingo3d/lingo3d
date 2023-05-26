import Components, { ObjectName } from "./Components"
import { LIBRARY_WIDTH } from "../../globals"
import useInitCSS from "../hooks/useInitCSS"
import AppBar from "../component/bars/AppBar"
import Tab from "../component/tabs/Tab"
import useInitEditor from "../hooks/useInitEditor"
import TextBox from "../component/TextBox"
import { useEffect, useMemo, useState } from "preact/hooks"
import { GameObjectType } from "../../api/serializer/types"
import { stopPropagation } from "../utils/stopPropagation"
import Templates from "./Templates"
import { librarySignal } from "./librarySignal"
import { getSelectionTarget } from "../../states/useSelectionTarget"

const objectNames = [
    { gameGraph: "joystick" },

    "cube",
    "sphere",
    "cone",
    "cylinder",
    "octahedron",
    "tetrahedron",
    "torus",
    "plane",
    "circle",

    "group",
    "model",
    "dummy",
    { dummyIK: "dummy" },
    "svgMesh",
    "htmlMesh",
    // { reticle: "htmlMesh" },
    { splashScreen: "screen" },
    "text",
    "spawnPoint",
    "audio",
    "reflector",
    "water",
    { sprite: "plane" },
    { spriteSheet: "plane" },

    "areaLight",
    "ambientLight",
    "skyLight",
    "directionalLight",
    "pointLight",
    "spotLight",
    { pooledPointLight: "light" },
    { pooledSpotLight: "light" },
    { environment: "light" },
    "camera",
    "thirdPersonCamera",
    "firstPersonCamera",
    "orbitCamera"
] satisfies ObjectName

type Props = {
    onDragStart?: (name: GameObjectType) => void
    onDragEnd?: () => void
}

const Library = ({ onDragStart, onDragEnd }: Props) => {
    useInitCSS()
    useInitEditor()

    const [search, setSearch] = useState<string>()
    const [deselect, setDeselect] = useState({})

    useEffect(() => {
        const handle = getSelectionTarget((val) => !val && setDeselect({}))
        return () => {
            handle.cancel()
        }
    }, [])

    const names = useMemo(
        () =>
            search
                ? objectNames.filter((n) =>
                      (typeof n === "object" ? Object.keys(n)[0] : n)
                          .toLowerCase()
                          .includes(search)
                  )
                : objectNames,
        [search]
    )

    return (
        <div
            ref={stopPropagation}
            className="lingo3d-ui lingo3d-bg lingo3d-library lingo3d-flexcol"
            style={{ width: LIBRARY_WIDTH, height: "100%" }}
        >
            <AppBar style={{ padding: 10 }}>
                <Tab width="100%" selectedSignal={librarySignal}>
                    components
                </Tab>
                <Tab width="100%" selectedSignal={librarySignal}>
                    templates
                </Tab>
            </AppBar>
            <TextBox
                onChange={(val) => setSearch(val.toLowerCase())}
                clearOnChange={deselect}
            />
            <div style={{ padding: 10, overflowY: "scroll", flexGrow: 1 }}>
                {librarySignal.value.at(-1) === "components" && (
                    <Components
                        names={names}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                    />
                )}
                {librarySignal.value.at(-1) === "templates" && <Templates />}
            </div>
        </div>
    )
}
export default Library
