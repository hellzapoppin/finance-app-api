import { prisma } from '../../../../prisma/prisma'
import { PostgresUpdateUserRepository } from './update-user'
import { user } from './../../../tests/index.js'
import { faker } from '@faker-js/faker'

describe('Update User Repository', () => {
    it('should update an user on DB', async () => {
        const createdUser = await prisma.user.create({ data: user })
        const sut = new PostgresUpdateUserRepository()

        const updateUserParams = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }

        const result = await sut.execute(createdUser.id, updateUserParams)

        expect(result).toStrictEqual({ ...user, ...updateUserParams })
    })
})
