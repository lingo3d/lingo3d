import { upperFirst } from "@lincode/utils";

export default (appendable: any) => appendable.name || upperFirst(appendable.constructor.componentName)