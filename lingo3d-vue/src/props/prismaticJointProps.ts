import {
  prismaticJointSchema,
  prismaticJointDefaults
} from "lingo3d/lib/interface/IPrismaticJoint"
import makeProps from "./utils/makeProps"

export default makeProps(prismaticJointSchema, prismaticJointDefaults)
