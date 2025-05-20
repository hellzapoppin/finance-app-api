import { IdGeneratorAdapter } from './id-generator'

describe('Id Generator Adapter', () => {
    it('should return a random id', () => {
        const sut = new IdGeneratorAdapter()

        const result = sut.execute()

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        )
    })
})
