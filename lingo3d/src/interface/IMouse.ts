import VisibleMixin from "../display/core/mixins/VisibleMixin"
import { Point3dType } from "../typeGuards/isPoint"
import IAppendable, {
    appendableDefaults,
    appendableSchema
} from "./IAppendable"
import { extendDefaults } from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"
import Nullable from "./utils/Nullable"

export class LingoMouseEvent {
    public constructor(
        public x: number,
        public y: number,
        public clientX: number,
        public clientY: number,
        public xNorm: number,
        public yNorm: number,
        public point: Point3dType,
        public normal: Point3dType,
        public distance: number,
        public target: VisibleMixin | undefined
    ) {}
}

export class SimpleMouseEvent {
    public constructor(
        public x: number,
        public y: number,
        public clientX: number,
        public clientY: number
    ) {}
}

export default interface IMouse extends IAppendable {
    onClick: Nullable<(e: SimpleMouseEvent) => void>
    onRightClick: Nullable<(e: SimpleMouseEvent) => void>
    onMouseMove: Nullable<(e: SimpleMouseEvent) => void>
    onMouseDown: Nullable<(e: SimpleMouseEvent) => void>
    onMouseUp: Nullable<(e: SimpleMouseEvent) => void>
    onMousePress: Nullable<(e: SimpleMouseEvent) => void>
}

export const mouseSchema: Required<ExtractProps<IMouse>> = {
    ...appendableSchema,
    onClick: Function,
    onRightClick: Function,
    onMouseMove: Function,
    onMouseDown: Function,
    onMouseUp: Function,
    onMousePress: Function
}

export const mouseDefaults = extendDefaults<IMouse>([appendableDefaults], {
    onClick: undefined,
    onRightClick: undefined,
    onMouseMove: undefined,
    onMouseDown: undefined,
    onMouseUp: undefined,
    onMousePress: undefined
})
