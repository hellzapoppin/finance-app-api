import { GetUserByIdController } from '../../controllers'
import { makeGetUserByIdController } from './users'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })
})
