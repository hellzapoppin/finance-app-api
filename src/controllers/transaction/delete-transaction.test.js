import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute(transactionId) {
            return transactionId
        }
    }

    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
    }

    it('should return 200 if transaction is deleted', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })
})
