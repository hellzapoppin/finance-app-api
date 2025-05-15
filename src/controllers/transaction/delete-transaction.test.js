import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return transaction
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

    it('should return 400 when transaction ID is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                transactionId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when transaction is not found', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.transactionId,
        )
    })
})
