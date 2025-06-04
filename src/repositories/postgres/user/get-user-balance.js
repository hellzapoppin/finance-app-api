// criando inserção no banco sem o ORM Prisma
// import { PostgresHelper } from '../../../db/postgres/helpers.js'

import { Prisma } from '../../../../src/generated/prisma/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { TransactionType } from '@prisma/client'

export class PostgresGetUserBalanceRepository {
    async execute(userId, from, to) {
        const dateFilter = {
            date: {
                gte: new Date(from),
                lte: new Date(to),
            },
        }
        const {
            _sum: { amount: totalExpenses },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EXPENSE,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalEarnings },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.EARNING,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const {
            _sum: { amount: totalInvestments },
        } = await prisma.transaction.aggregate({
            where: {
                user_id: userId,
                type: TransactionType.INVESTMENT,
                ...dateFilter,
            },
            _sum: {
                amount: true,
            },
        })

        const _totalEarnings = totalEarnings || new Prisma.Decimal(0)
        const _totalExpenses = totalExpenses || new Prisma.Decimal(0)
        const _totalInvestments = totalInvestments || new Prisma.Decimal(0)

        const balance = new Prisma.Decimal(
            _totalEarnings - _totalExpenses - _totalInvestments,
        )
        return {
            earnings: _totalEarnings,
            expenses: _totalExpenses,
            investments: _totalInvestments,
            balance,
        }

        // criando inserção no banco sem o ORM Prisma
        // const balance = await PostgresHelper.query(
        //     `SELECT * FROM get_user_balance($1)`,
        //     [userId],
        // )

        // return {
        //     userId,
        //     ...balance[0],
        // }
    }
}
