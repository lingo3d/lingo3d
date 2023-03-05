export default class DefaultValue {
    public constructor(public value?: string | number | boolean) {
        Object.freeze(this)
    }
}
