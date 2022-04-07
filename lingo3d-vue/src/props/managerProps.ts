import { objectManagerDefaults } from "lingo3d/lib/interface/IObjectManager"

const props = {
  innerRotationX: {
    type: Number,
    default: objectManagerDefaults.innerRotationX,
  },
  innerRotationY: {
    type: Number,
    default: objectManagerDefaults.innerRotationY,
  },
  innerRotationZ: {
    type: Number,
    default: objectManagerDefaults.innerRotationZ,
  },
  innerRotation: {
    type: Number,
    default: objectManagerDefaults.innerRotation,
  },
  innerX: {
    type: Number,
    default: objectManagerDefaults.innerX,
  },
  innerY: {
    type: Number,
    default: objectManagerDefaults.innerY,
  },
  innerZ: {
    type: Number,
    default: objectManagerDefaults.innerZ,
  },
}

export default props
