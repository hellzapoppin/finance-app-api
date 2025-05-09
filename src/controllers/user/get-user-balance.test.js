import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'

describe('Get User Balance Controller', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            const earnings = faker.finance.amount({ min: 5, max: 10 })
            const expenses = faker.finance.amount({ min: 4, max: 5 })
            const investments = faker.finance.amount({ min: 4, max: 5 })
            const balance = earnings - expenses - investments
            return {
                earnings,
                expenses,
                investments,
                balance,
            }
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const sut = new GetUserBalanceController(getUserBalanceUseCase)

        return { sut, getUserBalanceUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting user balance', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
