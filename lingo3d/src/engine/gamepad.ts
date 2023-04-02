import toFixed from "../api/serializer/toFixed"
import { onBeforeRender } from "../events/onBeforeRender"

"getGamepads" in navigator &&
    onBeforeRender(() => {
        for (const pad of navigator.getGamepads()) {
            if (!pad) continue

            for (let i = 0; i < pad.buttons.length; i++) {
                const button = pad.buttons[i]
                const pct = Math.round(button.value * 100) + "%"

                button.pressed &&
                    console.log(i, button.value, button.pressed, pct)
            }
            for (let i = 0; i < pad.axes.length; i++) {
                const val = toFixed(pad.axes[i])
                val !== 0 && console.log(i, val)
            }
        }
    })
