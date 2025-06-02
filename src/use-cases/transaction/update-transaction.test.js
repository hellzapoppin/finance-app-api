import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'
import { transaction } from '../../tests/index.js'

describe('Update Transaction Use Case', () => {
    const updateTransactionParams = { name: faker.book.title() }
    class UpdateTransactionRepositoryStub {
        async execute(transactionId, updateTransactionParams) {
            return {
                ...transaction,
                ...updateTransactionParams,
                id: transactionId,
            }
        }
    }

    class GetTransactionByIdRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()
        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            updateTransactionRepository,
            getTransactionByIdRepository,
        }
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
