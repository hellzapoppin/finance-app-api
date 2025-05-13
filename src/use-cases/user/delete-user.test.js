import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'

describe('Delete User Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    const userId = faker.string.uuid()

    class DeleteUserRepositoryStub {
        async execute(userId) {
            return { ...user, id: userId }
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)

        return { sut, deleteUserRepository }
    }

    it('should successfully delete an user', async () => {
        const { sut } = makeSut()

        const deletedUser = await sut.execute(userId)

        expect(deletedUser).toEqual({ ...user, id: userId })
    })

    it('should call DeleteUserUseCase with correct params', async () => {
        const { sut, deleteUserRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteUserRepository, 'execute')

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const promise = sut.execute(userId)

        expect(promise).rejects.toThrow()
    })
})
