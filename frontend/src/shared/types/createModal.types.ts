export type CreateModalProps<TPayload = unknown> = {
    onClose: () => void
    onCreate: (payload: TPayload) => void | Promise<void>
}
