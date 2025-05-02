import {
    PostgresUpdateUserRepository,
    PostgresGetUserByEmailRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'
import bycrypt from 'bcrypt'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        // se o email estiver sendo atualizado, verificar se já existe
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()
            const userAlreadyExists =
                await postgresGetUserByEmailRepository.execute(
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

        const updateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = updateUserRepository.execute(userId, user)

        return updatedUser
    }
}
