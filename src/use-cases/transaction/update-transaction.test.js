import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('Update Transaction Use Case', () => {
    const updateTransactionParams = { name: faker.book.title() }

    const transaction = {
        id: faker.string.uuid(),
        use_id: faker.string.uuid(),
        name: faker.book.title(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElements(['EARNING', 'EXPENSE', 'INVESTMENT']),
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId, updateTransactionParams) {
            return {
                ...transaction,
                ...updateTransactionParams,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(updateTransactionRepository)

        return { sut, updateTransactionRepository }
    }

    it('should update a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        expect(result).toEqual({
            ...transaction,
            ...updateTransactionParams,
            id: transaction.id,
        })
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionRepository, 'execute')

        await sut.execute(transaction.id, updateTransactionParams)

        expect(executeSpy).toHaveBeenCalledWith(
            transaction.id,
            updateTransactionParams,
        )
    })

    it('should call UpdateTransactionRepository with correct params', async () => {
        const { sut, updateTransactionRepository } = makeSut()
        jest.spyOn(
            updateTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, updateTransactionParams)

        expect(promise).rejects.toThrow()
    })
})
