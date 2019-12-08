import fetch from 'node-fetch'
import { handler } from '../breeds-get'
import * as mockData from '../mock-data/breeds'

const mockedFetch: jest.Mock = fetch as any

jest.mock('node-fetch')

describe('breeds-get handler success', () => {
  const flattenedPayloadSuccess = {
    body: mockData.FLATTENED_MOCK_BREEDS_PARTIAL,
    statusCode: 200,
  }

  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce({
      json: () => {
        return mockData.MOCK_BREEDS_PARTIAL
      },
    })
  })
  it('gets success payload from fetch request', async () => {
    const res = await handler()
    expect(res).toMatchObject(flattenedPayloadSuccess)
  })
})

describe('breeds-get handler error', () => {
  const apiErrorPayload = {
    body: mockData.MOCK_BREEDS_ERROR.message,
    statusCode: mockData.MOCK_BREEDS_ERROR.code,
  }

  it('throws error if fetch request returns error', async () => {
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockData.MOCK_BREEDS_ERROR
      },
    })
    const res = await handler()
    expect(res).toMatchObject(apiErrorPayload)
  })

  it('throws error if service times out', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('mock timeout'))

    const timeOutErrorPayload = {
      body: 'Oops! Error Occurred',
      statusCode: 500,
    }
    const res = await handler()
    expect(res).toMatchObject(timeOutErrorPayload)
  })
})
