import { texturedStandardDefaults } from "../../../../interface/ITexturedStandard"
import { equalsDefaultValue } from "../../../../interface/utils/getDefaultValue"

export default (value: any, key: string) =>
    !equalsDefaultValue(value, texturedStandardDefaults, key)
