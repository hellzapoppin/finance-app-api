import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('Update Transaction Use Case', () => {
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
        const updateTransactionParams = { name: faker.book.title() }
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
})
