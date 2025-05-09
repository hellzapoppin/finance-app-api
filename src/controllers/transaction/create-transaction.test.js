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

    it('should return 400 when missing user_id', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            user_id: undefined,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing name', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            name: undefined,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            date: undefined,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            type: undefined,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            amount: undefined,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            date: 'invalid_date',
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest.body,
            type: 'invalid_type',
        })

        expect(result.statusCode).toBe(400)
    })
})
