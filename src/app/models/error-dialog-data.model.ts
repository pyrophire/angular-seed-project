/** Data accepted by `ErrorDialogComponent`. */
export interface ErrorDialogData {
    title: string;
    message: string;
    /** Who to contact; shown under the message when provided. */
    supportMessage?: string;
    /** HTTP status of the failed request, when the dialog reports one. */
    status?: number;
}
