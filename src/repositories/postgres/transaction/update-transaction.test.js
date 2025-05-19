import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests/index.js'
import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'

describe('Postgres Update Transaction Repository', () => {
    it('should update a transacion on DB successfully', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const updateTransactionParams = {
            user_id: user.id,
            name: faker.book.title(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: faker.helpers.arrayElement([
                TransactionType.EARNING,
                TransactionType.EXPENSE,
                TransactionType.INVESTMENT,
            ]),
        }

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        expect(result.id).toBe(transaction.id)
        expect(result.name).toBe(updateTransactionParams.name)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
        expect(result.type).toBe(updateTransactionParams.type)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(updateTransactionParams.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(
            dayjs(updateTransactionParams.date).month(),
        )
        expect(dayjs(result.date).year()).toBe(
            dayjs(updateTransactionParams.date).year(),
        )
    })
})
