import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }

    const httpRequest = {
        body: {
            id: faker.string.uuid(),
            user_id: faker.string.uuid(),
            name: faker.book.title(),
            date: faker.date.anytime().toISOString(),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENTS',
            ]),
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 if a transaction is created', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(201)
    })

    it('', async () => {})
    it('', async () => {})
    it('', async () => {})
})
