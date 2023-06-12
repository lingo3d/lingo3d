type TextureType =
    | "diffuse"
    | "metalness"
    | "roughness"
    | "normal"
    | "ao"
    | "height"
    | "env"
    | "displacement"

export const getTextureType = (filename: string): TextureType => {
    const name = filename.toLowerCase()
    if (name.includes("rough")) return "roughness"
    else if (name.includes("metal")) return "metalness"
    else if (name.includes("normal")) return "normal"
    else if (name.includes("disp")) return "displacement"
    else if (name.includes("height")) return "height"
    else if (name.includes("env")) return "env"
    else if (name.includes("ao")) return "ao"
    return "diffuse"
}
