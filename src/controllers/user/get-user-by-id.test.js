import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'
import { user } from '../../tests/index.js'

describe('Get User By Id Controller', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if user is found', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid id is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(null)

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an error', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValue(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
