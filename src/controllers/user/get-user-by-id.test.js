import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('Get User By Id Controller', () => {
    class GetUserByIdUseCaseStub {
        async execute(userId) {
            return {
                id: userId,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }
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
})
