import { Point } from "@lincode/math"
import { signal, Signal } from "@preact/signals"

const menuSignal: Signal<
    | (Point & {
          search?: boolean
          createJoint?: boolean
      })
    | undefined
> = signal(undefined)

export default menuSignal
