import { EmailAlreadyInUseError } from '../errors/user.js'
import bycrypt from 'bcrypt'

export class UpdateUserUseCase {
    constructor(getUserByEmailRepository, updateUserRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.updateUserRepository = updateUserRepository
    }
    async execute(userId, updateUserParams) {
        // se o email estiver sendo atualizado, verificar se já existe
        if (updateUserParams.email) {
            const userAlreadyExists =
                await this.getUserByEmailRepository.execute(
                    updateUserParams.email,
                )
            if (userAlreadyExists && userAlreadyExists.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        // se a senha for atualizada, criptografá-la
        if (updateUserParams.password) {
            const hashedPassword = await bycrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }

        const updatedUser = this.updateUserRepository.execute(userId, user)

        return updatedUser
    }
}
