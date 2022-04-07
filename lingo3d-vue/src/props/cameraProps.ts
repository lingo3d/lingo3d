import { cameraBaseDefaults } from "lingo3d/lib/interface/ICameraBase"

const props = {
  minPolarAngle: {
    type: Number,
    default: cameraBaseDefaults.minPolarAngle,
  },
  maxPolarAngle: {
    type: Number,
    default: cameraBaseDefaults.maxPolarAngle,
  },
  mouseControl: {
    type: Boolean,
    default: cameraBaseDefaults.mouseControl,
  },
  mouseControlMode: {
    type: String,
    default: cameraBaseDefaults.mouseControlMode,
  },
}

export default props
