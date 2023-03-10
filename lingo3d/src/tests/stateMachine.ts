import { createMachine } from "xstate"

export default createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOlwgBswBiAJQFUA5AfQGUAVAQVvYG0AGALqJQABwD2sXABdc4-CJAAPRAEYA7PxIAWAJz6AHACZV-ftoCsRgMzaANCACeibaoMlNB6wDZv-I0Z+mtoAviEOaFh4hKTkVHRMzABCnADCANIA6twAIqxsXDwCwkggElKy8ooqCBpaeoYmZpY29k6IFtraHhbNqroGndZeYREYOATEZJQ0AFL0ALIACgXcfEKK5TJyCqU1dTr6A03mVrYOzghG-iRGvc29murenaMgkRMxJABOAK74+AIUASLA4AHklsVNpJtlU9ogjMYPIELD4DN5AuZvNYLog0bd+F5UVYBv1nm8PtEpn8AUCQck0llcvkOGsoaUtpVdqAahZeiRrOo9Kj1KojOpdBYDLiENojN0zGZrBZ1NZdOZtOoKeMqaQaYD8MD5stVkUNhyYVzqh1+YLhYKxRKpTLrDYSIr+KZ1KjNf5tVFJnr-gaoEksABrADu6G+EFg9PBkPNYktO2tCF8RhIflUvQMmr02gMqhlvgsJHu5mM1jcNd0-s+1ODQLDmCjMbjCcK6xKKYqafhGc6tzc3iFmmubl0LtVFcVNnlGJV2m8Dd1P2bhtb7dj8eNK1ZZt7ZVTcJ5ajM5dcaoG3qFenUMtRuh0iu0NZXfm8qjXgZIACtflQUQ6X3AoIXZPtYW5ZQL1UawPF0bwDEJOULF0VR3xlYtDiOYwv2MetwneHU-0A4C6RyMF6CSAAZABRZgwMPHtoX7M9YNqBcPBrF5VQGd9AhlTESDcFcxT465kN-L4IHEX4ACMqGYciQMNahmPYCDkxPdiYP2QJVAFLpdGVV05XUSyZSLDx1ACUxHQxPRVFXN58HECA4EUSlAzY6D0wAWm8GUAuGZFLOeYtVH6ExrBkqY4jAPyrUHOVSysbN+FFdEMTsl54qDWlDWSgdz1lO4K3UFDBmGdVTKMaz4OzO5PUsO19FCYifK+fUWwjaNdxKjiamLK9UX4FUzEwnxH3aBBnxIdVLwsfoDC8EYutIr5VKBIb9LUDRvEWkwUP4awJvMQUXRMUT7hsJDkInAqSDkxTlJ24qLT09MxWsBDSV8aLLDMac5tMdxLPsz1xSc3QjDCMIgA */
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
                JUMP_STOP: "idle",
                DOUBLE_JUMP_START: "double_jumping"
            }
        },

        double_jumping: {
            on: {
                JUMP_STOP: "idle"
            }
        }
    },
    initial: "idle"
})
