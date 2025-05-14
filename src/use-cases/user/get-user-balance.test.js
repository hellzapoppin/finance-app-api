import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance.js'
import { UserNotFoundError } from '../../errors/user'

describe('Get User Balance Use Case', () => {
    const userId = faker.string.uuid()

    const user = {
        id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const userBalance = {
        earnings: Number(faker.finance.amount()),
        expenses: Number(faker.finance.amount()),
        investments: Number(faker.finance.amount()),
        balance: Number(faker.finance.amount()),
    }

    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return { sut, getUserBalanceRepository, getUserByIdRepository }
    }

    it('should get user balance successfully', async () => {
        const { sut } = makeSut()

        const balance = await sut.execute(userId)

        expect(balance).toEqual(userBalance)
    })

    it('should throws UserNotFoundError is GetUserByIdRepository returns null', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValueOnce(null)

        const promise = sut.execute(userId)

        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
