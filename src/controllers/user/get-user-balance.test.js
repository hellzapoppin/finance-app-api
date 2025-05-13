import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'

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

    it('should return 500 if GetUserBalanceUseCase throws', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })

    it('should return 404 if GetUserBalanceUseCase throws UserNotFoundError', async () => {
        const { sut, getUserBalanceUseCase } = makeSut()
        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new UserNotFoundError(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })
})
