import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests/index.js'

describe('Create User Repository', () => {
    it('should create an user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result).toBeTruthy()
    })
})
