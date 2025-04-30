import { v4 as uuidv4 } from 'uuid'
import bycrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        // TODO: verificar se o email já está em uso

        // gerar ID do usuárionpm i uuid
        const userId = uuidv4()

        // criptografar senha
        const hashedPassword = await bycrypt.hash(createUserParams.password, 10)

        // inserir o usuário no banco de dados
        const user = {
            id: userId,
            ...createUserParams,
            password: hashedPassword,
        }

        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
