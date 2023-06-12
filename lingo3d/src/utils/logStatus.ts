import { editorBehaviorPtr } from "../pointers/editorBehaviorPtr"

export default (message: any) => editorBehaviorPtr[0] && console.log(message)
