import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
    async execute(userId) {
        const deleteUserByIdRepository = new PostgresDeleteUserRepository()

        const deletedUser = await deleteUserByIdRepository.execute(userId)

        return deletedUser
    }
}
