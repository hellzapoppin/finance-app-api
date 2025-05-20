import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTrasactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
