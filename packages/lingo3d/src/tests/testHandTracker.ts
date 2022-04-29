import { container, settings } from ".."
import HandTracker from "../api/HandTracker"

export default {}

const tracker = new HandTracker({ width: 160, height: 120, modelComplexity: 0 })
tracker.visualize = true

container.prepend(tracker.element)