export class DeleteUserUseCase {
    constructor(deleteUserByIdRepository) {
        this.deleteUserByIdRepository = deleteUserByIdRepository
    }
    async execute(userId) {
        const deletedUser = await this.deleteUserByIdRepository.execute(userId)

        return deletedUser
    }
}
