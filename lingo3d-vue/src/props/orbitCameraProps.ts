import { orbitCameraDefaults } from "lingo3d/lib/interface/IOrbitCamera"

const props = {
  targetX: {
    type: Number,
    default: orbitCameraDefaults.targetX,
  },
  targetY: {
    type: Number,
    value: orbitCameraDefaults.targetY,
  },
  targetZ: {
    type: Number,
    value: orbitCameraDefaults.targetZ,
  },
  x: {
    type: Number,
    value: orbitCameraDefaults.x,
  },
  y: {
    type: Number,
    value: orbitCameraDefaults.y,
  },
  z: {
    type: Number,
    value: orbitCameraDefaults.z,
  },
  enableDamping: {
    type: Boolean,
    value: orbitCameraDefaults.enableDamping,
  },
  enablePan: {
    type: Boolean,
    value: orbitCameraDefaults.enablePan,
  },
  enableZoom: {
    type: Boolean,
    value: orbitCameraDefaults.enableZoom,
  },
  autoRotate: {
    type: Boolean,
    value: orbitCameraDefaults.autoRotate,
  },
  autoRotateSpeed: {
    type: Number,
    value: orbitCameraDefaults.autoRotateSpeed,
  },
}

export default props
