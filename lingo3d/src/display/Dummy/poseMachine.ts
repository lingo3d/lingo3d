import { createMachine } from "xstate"

export default createMachine({
    states: {
        "idle": {
            on: {
                RUN_START: "running",
                RUN_BACKWARDS_START: "runningBackwards",
                JUMP_START: "falling"
            }
        },
        "running": {
            on: {
                RUN_STOP: "idle",
                RUN_BACKWARDS_START: "runningBackwards",
                JUMP_START: "falling"
            }
        },
        "runningBackwards": {
            on: {
                RUN_STOP: "idle",
                RUN_START: "running",
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