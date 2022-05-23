import { createMachine } from "xstate"

export default createMachine({
    states: {
        "idle": {
            on: {
                RUN_START: "running",
                JUMP_START: "falling"
            }
        },
        "running": {
            on: {
                RUN_STOP: "idle",
                JUMP_START: "falling"
            }
        },
        "falling": {
            on: {
                JUMP_STOP: "idle"
            }
        }
    },
    initial: "idle"
})