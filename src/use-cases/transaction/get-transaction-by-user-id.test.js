import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user'

describe('Get Transaction By User Id', () => {
    const userId = faker.string.uuid()

    const transactions = [
        {
            id: faker.string.uuid(),
            name: faker.book.title(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: faker.helpers.arrayElements([
                'EARNING',
                'EXPENSE',
                'INVESTMENT',
            ]),
        },
    ]

    class GetUserByIdRepositoryStub {
        async execute(userId) {
            return {
                id: userId,
                fist_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
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
})
