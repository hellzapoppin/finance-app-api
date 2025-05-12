import { faker } from '@faker-js/faker'
import { DeleteUserController } from './delete-user.js'

describe('Delete User Controller', () => {
    class DeleteUserCaseStub {
        async execute(userId) {
            return {
                id: userId,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const deleteUserUseCase = new DeleteUserCaseStub()
        const sut = new DeleteUserController(deleteUserUseCase)

        return { sut, deleteUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if user is deleted', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({ params: { userId: 'invalid_id' } })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(null)

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if DeleteUserUseCase throws', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        jest.spyOn(deleteUserUseCase, 'execute').mockRejectedValue(new Error())

        const result = await sut.execute(deleteUserUseCase)

        expect(result.statusCode).toBe(500)
    })

    it('should call DeleteUserUseCase with correct params', async () => {
        const { sut, deleteUserUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteUserUseCase, 'execute')

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
