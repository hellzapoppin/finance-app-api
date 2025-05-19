export class TransactionNotFoundError extends Error {
    constructor(transactionId) {
        super(`Transaction with ID ${transactionId} not found`)
        this.name = 'TransactionNotFoundError'
    }
}
