import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'

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

    it('should return 400 if an invalid pssword is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 3 }),
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if an invalid ID is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: {
                userId: 'invalid_id',
            },
            body: httpRequest.body,
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if a not allowed field is provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            params: httpRequest.params,
            body: {
                ...httpRequest.body,
                not_allowed_field: 'not_allowed_field',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserUseCase throws an error', async () => {
        const { sut, updateUserUseCaseStub } = makeSut()
        jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValue(
            new Error(),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws EmailAlreadyInUseError error', async () => {
        const { sut, updateUserUseCaseStub } = makeSut()
        jest.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValue(
            new EmailAlreadyInUseError(faker.internet.email),
        )

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        const { sut, updateUserUseCaseStub } = makeSut()
        const executeSpy = jest.spyOn(updateUserUseCaseStub, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })
})
