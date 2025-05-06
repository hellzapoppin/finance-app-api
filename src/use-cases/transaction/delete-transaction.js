export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository, getTransactionByIdRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }
    async execute(transactionId) {
        const transaction =
            await this.deleteTransactionRepository.execute(transactionId)

        return transaction
    }
}
