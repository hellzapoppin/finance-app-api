import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests/index.js'
import { prisma } from './../../../../prisma/prisma.js'

describe('Create User Repository', () => {
    it('should create an user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository()
        const primaSpy = jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(primaSpy).toHaveBeenLastCalledWith({ data: user })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresCreateUserRepository()
        jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        expect(promise).rejects.toThrow()
    })
})
