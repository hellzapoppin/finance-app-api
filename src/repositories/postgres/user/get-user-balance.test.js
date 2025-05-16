import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { user } from '../../../tests'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { TransactionType } from '@prisma/client'

describe('Get User Balance Repository', () => {
    it('should get user balance on DB', async () => {
        const createdUser = await prisma.user.create({ data: user })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.book.title(),
                    amount: 20000,
                    type: 'EXPENSE',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
                {
                    name: faker.book.title(),
                    amount: 20000,
                    type: 'EXPENSE',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
                {
                    name: faker.book.title(),
                    amount: 40000,
                    type: 'EARNING',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
                {
                    name: faker.book.title(),
                    amount: 40000,
                    type: 'EARNING',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
                {
                    name: faker.book.title(),
                    amount: 10000,
                    type: 'INVESTMENT',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
                {
                    name: faker.book.title(),
                    amount: 10000,
                    type: 'INVESTMENT',
                    date: faker.date.anytime(),
                    user_id: createdUser.id,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()
        const result = await sut.execute(createdUser.id)

        expect(result.balance.toString()).toBe('20000')
        expect(result.earnings.toString()).toBe('80000')
        expect(result.expenses.toString()).toBe('40000')
        expect(result.investments.toString()).toBe('20000')
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(user.id)

        expect(prismaSpy).toHaveBeenCalledTimes(3)
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                user_id: user.id,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        })
    })
})
