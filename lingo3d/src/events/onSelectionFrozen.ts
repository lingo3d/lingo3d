import { event } from "@lincode/events"
import MeshItem from "../display/core/MeshItem"

export const [emitSelectionFrozen, onSelectionFrozen] = event<MeshItem>()