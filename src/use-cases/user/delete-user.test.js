import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'

describe('Delete User Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

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
        const userId = faker.string.uuid()

        const deletedUser = await sut.execute(userId)

        expect(deletedUser).toEqual({ ...user, id: userId })
    })
})
