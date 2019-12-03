import fetch from 'node-fetch'
import { Response } from './shared/types'
import * as constants from './shared/constants'

interface StuffResponse extends Response {
  body: RandomDog
}

interface RandomDog {
  message: string
  status: string
}

export async function handler(): Promise<StuffResponse> {
  const res = await fetch(constants.RANDOM_DOG_IMAGE_API)
  const payload: RandomDog = await res.json()
  return {
    statusCode: 200,
    body: payload,
  }
}
