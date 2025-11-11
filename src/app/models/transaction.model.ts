export class TransactionResult<T> {
    version: string;
    transactionId: string;
    message: string;
    success: boolean;
    results: T;
}
