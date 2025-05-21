import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'
import { TransactionNotFoundError } from '../../errors/transaction.js'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.book.title(),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: faker.helpers.arrayElement([
                    'EARNING',
                    'EXPENSE',
                    'INVESTMENT',
                ]),
            }
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const httpRequest = {
        params: {
            transactionId: faker.string.uuid(),
        },
        body: {
            name: faker.book.title(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: faker.helpers.arrayElement([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        },
    }

    it('should return 200 when updating a transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when transaction id if invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, unallowed_field: 'unallowed_field' },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid amount is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, amount: 'invalid_amount' },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when an invalid type is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            ...httpRequest,
            body: { ...httpRequest.body, type: 'invalid_amount' },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws a generic error', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 404 when TransactionNotFound is thrown', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        jest.spyOn(updateTransactionUseCase, 'execute').mockRejectedValueOnce(
            new TransactionNotFoundError(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(updateTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
            httpRequest.body,
        )
    })
})
