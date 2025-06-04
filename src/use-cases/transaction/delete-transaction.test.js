import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'
import { transaction } from '../../tests/index.js'

describe('Delete Transaction Use Case', () => {
    const transactionId = faker.string.uuid()
    const user_id = faker.string.uuid()
    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return { ...transaction, id: transactionId, user_id }
        }
    }
    class GetTransactionByIdRepositoryStub {
        async execute() {
            return { ...transaction, id: transactionId, user_id }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository =
            new DeleteTransactionRepositoryStub()

        const getTransactionByIdRepository =
            new GetTransactionByIdRepositoryStub()

        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepository,
            getTransactionByIdRepository,
        )

        return {
            sut,
            deleteTransactionRepository,
            getTransactionByIdRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transactionId, user_id)

        expect(result).toEqual({ ...transaction, id: transactionId, user_id })
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')

        await sut.execute(transactionId, user_id)

        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })

    it('should throws if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(transactionId, user_id)

        expect(promise).rejects.toThrow()
    })
})
