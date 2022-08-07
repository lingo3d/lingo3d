import { createMachine } from "xstate"

export default createMachine({
    predictableActionArguments: true,
    states: {
        idle: {
            on: {
                RUN_START: "running",
                RUN_BACKWARDS_START: "runningBackwards",
                JUMP_START: "jumping"
            }
        },
        running: {
            on: {
                RUN_STOP: "idle",
                RUN_BACKWARDS_START: "runningBackwards",
                JUMP_START: "jumping"
            }
        },
        runningBackwards: {
            on: {
                RUN_STOP: "idle",
                RUN_START: "running",
                JUMP_START: "jumping"
            }
        },
        jumping: {
            on: {
                JUMP_STOP: "idle"
            }
        }
    },
    initial: "idle"
})
