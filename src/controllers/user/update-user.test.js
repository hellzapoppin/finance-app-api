import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'

describe('Update User Controller', () => {
    class UpdateUserUseCaseStub {
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
        const updateUserUseCaseStub = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCaseStub)

        return { sut, updateUserUseCaseStub }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        },
    }

    it('should return 200 if an user is updated', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if an invalid email is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                email: 'invalid_email',
            },
        })

        expect(result.statusCode).toBe(400)
    })
})
