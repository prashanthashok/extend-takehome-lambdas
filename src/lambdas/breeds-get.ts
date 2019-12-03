import fetch from 'node-fetch'
import * as constants from './constants'
import { Response } from './types'

interface BreedResponse extends Response {
  body: string[]
}

interface DogBreeds {
  // message type is any because this can either be an object (successful response)
  // or a string (failure)
  message: any
  status: string
  code: number
}

// Method to flatten response from Breed API
// input should be a list of key-value pairs
// where key = breed-type in string
// and value = string array of sub-breed types (0 or more)
const flatten = (data: any): string[] => {
  const parsedData: string[] = []

  Object.keys(data).forEach(key => {
    const subBreeds = data[key]
    if (subBreeds.length > 0) {
      subBreeds.forEach((subBreed: string) => {
        parsedData.push(`${subBreed} ${key}`)
      })
    } else {
      parsedData.push(key)
    }
  })

  return parsedData
}

export async function handler(): Promise<BreedResponse> {
  try {
    const res = await fetch(constants.DOG_BREEDS_API)

    const payload: DogBreeds = await res.json()
    // handle parsing errors
    if (payload.status === 'error') {
      return {
        statusCode: payload.code,
        body: payload.message,
      }
    }

    // flatten response to single array of strings containing both breeds and sub-breeds
    const flatArrayOfBreeds = flatten(payload.message)
    return {
      statusCode: 200,
      body: flatArrayOfBreeds,
    }
  } catch (e) {
    return {
      statusCode: e.name,
      body: e.message,
    }
  }
}
