import {
    CreateTransactionController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransactionController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTrasactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should return a valid UpdateTrasactionController instance', () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
})
