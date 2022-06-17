import { h } from "preact"
import register from "preact-custom-element"
import { preventTreeShake } from "@lincode/utils"

preventTreeShake(h)

// const Library = () => {
    
// }

// register(Library, "lingo3d-library")