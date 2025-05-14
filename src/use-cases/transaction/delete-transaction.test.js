import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('Delete Transaction Use Case', () => {
    const transactionId = faker.string.uuid()

    const transaction = {
        user_id: faker.string.uuid(),
        name: faker.book.title(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElements(['EARNING', 'EXPENSE', 'INVESTMENT']),
    }
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return { sut, deleteTransactionRepository }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transactionId)

        expect(result).toEqual({ ...transaction, id: transactionId })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

        await sut.execute(transactionId)

        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
