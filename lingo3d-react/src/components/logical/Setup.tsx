import { SetupNode } from "lingo3d/lib/display/utils/deserialize/types"
import applySetup from "lingo3d/lib/display/utils/deserialize/applySetup"
import React, { useLayoutEffect } from "react"

const Setup: React.FC<Partial<SetupNode>> = props => {
    useLayoutEffect(() => {
        applySetup(props)

        return () => {
            applySetup({})
        }
    }, [JSON.stringify(props)])

    return null
}

export default Setup
