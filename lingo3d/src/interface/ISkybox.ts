import IEventLoop from "./IEventLoop"

export default interface ISkybox extends IEventLoop {
    texture?: string | Array<string>
}