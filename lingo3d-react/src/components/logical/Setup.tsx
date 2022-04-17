import applySetup from "lingo3d/lib/display/utils/deserialize/applySetup"
import React, { useLayoutEffect } from "react"
import ISetup from "lingo3d/lib/interface/ISetup"

const Setup: React.FC<ISetup> = props => {
    useLayoutEffect(() => {
        applySetup(props)

        return () => {
            applySetup({})
        }
    }, [JSON.stringify(props)])

    return null
}

export default Setup
