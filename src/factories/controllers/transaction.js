import {
    CreateTransactionController,
    DeleteTransactionController,
    GetTransactionsByUserIdController,
    UpdateTransactionController,
} from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostgresDeleteTransactionRepository,
    PostgresGetTransactionsByUserIdRepository,
    PostgresGetUserByIdRepository,
    PostgresUpdateTransactionRepository,
} from '../../repositories/postgres/index.js'
import {
    CreateTransactionUseCase,
    DeleteTransactionUseCase,
    GetTransactionsByUserIdUseCase,
    UpdateTransactionUseCase,
} from '../../use-cases/index.js'

import { IdGeneratorAdapter } from '../../adapters/index.js'
import { PostgresGetTransactionByIdRepository } from '../../repositories/postgres/transaction/get-transaction-by-id.js'

export const makeCreateTransactionController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const getUserByIdRepository = new PostgresGetUserByIdRepository()
    const idGeneratorAdapter = new IdGeneratorAdapter()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
        idGeneratorAdapter,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}

export const makeGetTransationsByUserIdController = () => {
    const getTransactionsByUserIdRepository =
        new PostgresGetTransactionsByUserIdRepository()
    const getUserByIdRepository = new PostgresGetUserByIdRepository()

    const getTransactionsByUserIdUseCase = new GetTransactionsByUserIdUseCase(
        getTransactionsByUserIdRepository,
        getUserByIdRepository,
    )

    const getTransactionsByUserIdController =
        new GetTransactionsByUserIdController(getTransactionsByUserIdUseCase)

    return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
    const updateTransactionRepository =
        new PostgresUpdateTransactionRepository()

    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()

    const updateTransactionUseCase = new UpdateTransactionUseCase(
        updateTransactionRepository,
        getTransactionByIdRepository,
    )

    const updateTransactionController = new UpdateTransactionController(
        updateTransactionUseCase,
    )

    return updateTransactionController
}

export const makeDeleteTransactionController = () => {
    const deleteTransactionRepository =
        new PostgresDeleteTransactionRepository()

    const getTransactionByIdRepository =
        new PostgresGetTransactionByIdRepository()

    const deleteTransactionUseCase = new DeleteTransactionUseCase(
        deleteTransactionRepository,
        getTransactionByIdRepository,
    )

    const deleteTransactionController = new DeleteTransactionController(
        deleteTransactionUseCase,
    )

    return deleteTransactionController
}
