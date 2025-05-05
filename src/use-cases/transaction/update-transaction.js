export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }
    async execute(transactionId, params) {
        const transation = await this.updateTransactionRepository.execute(
            transactionId,
            params,
        )

        return transation
    }
}
