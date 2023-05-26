import { Signal, signal } from "@preact/signals"
import Dialog from "../component/Dialog"

export const createDialogSignal: Signal<
    | {
          type: string
          data?: Record<string, any>
          onConfirm: (payload: {
              type: string
              name: string
              data?: Record<string, any>
          }) => void
      }
    | undefined
> = signal(undefined)

const CreateDialog = () => {
    return <Dialog signal={createDialogSignal}></Dialog>
}

export default CreateDialog
