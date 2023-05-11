import serialize from "../api/serializer/serialize";
import computePerFrame from "./utils/computePerFrame";

export default computePerFrame((_: void) => {
    console.log(serialize())
})