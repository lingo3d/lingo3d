import { settings, runtime } from "lingo3d"

settings.autoMount = true

for (const [key, value] of Object.entries(runtime)) {
    //@ts-ignore
    window[key] = value
}
