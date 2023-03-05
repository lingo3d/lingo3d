import { nanoid } from "nanoid"

//mark
const test = nanoid()

export default class DefaultValue {
    public constructor(public value: string | number | boolean = test) {
        Object.freeze(this)
    }
}
