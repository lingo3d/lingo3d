import downloadText from "../../utils/downloadText"
import serialize from "../serializer/serialize"
import { flushMultipleSelectionTargets } from "../../states/useMultipleSelectionTargets"

export default async () => {
    const { default: prettier } = await import("prettier/standalone")
    const { default: parser } = await import("prettier/parser-babel")

    flushMultipleSelectionTargets(
        () =>
            downloadText(
                "scene.json",
                prettier.format(JSON.stringify(serialize(true)), {
                    parser: "json",
                    plugins: [parser]
                })
            ),
        true
    )
}
