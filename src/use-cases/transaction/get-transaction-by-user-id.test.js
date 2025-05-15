import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user'
import { transaction, user } from '../../tests/index.js'

describe('Get Transaction By User Id', () => {
    const userId = faker.string.uuid()

    const transactions = [transaction]

    class GetUserByIdRepositoryStub {
        async execute() {
            return { id: userId, ...user }
        }
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute(userId) {
            return [{ ...transactions, user_id: userId }]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepository =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepository,
            getUserByIdRepository,
        )

        return { sut, getTransactionsByUserIdRepository, getUserByIdRepository }
    }

    it('should get transactions by user ID successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(userId)

        expect(result).toEqual([{ ...transactions, user_id: userId }])
    })

    it('should throws UserNotFoundError if user not found', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(userId)

        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenLastCalledWith(userId)
    })

    it('should call GetTransactionsByUserIdRepository with correct params', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        const executeSpy = jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        )

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenLastCalledWith(userId)
    })

    it('should throws if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(userId)

        expect(promise).rejects.toThrow()
    })

    it('should throws if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepository } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const promise = sut.execute(userId)

        expect(promise).rejects.toThrow()
    })
})
