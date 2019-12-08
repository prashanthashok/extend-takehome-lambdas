import fetch from 'node-fetch'
import * as constants from './shared/constants'
import { Response } from './shared/types'

interface BreedResponse extends Response {
  // body type can either be string array of breeds (successful response)
  // or a string (failure)
  body: string[] | string
}

interface DogBreeds {
  // message type can either be an object (successful response)
  // or a string (failure)
  message: UnflattenedDogBreed | string
  status: string
  code: number
}

interface UnflattenedDogBreed {
  [key: string]: string[]
}

// Method to flatten response from Breed API
// input should be a list of key-value pairs
// where key = breed-type in string
// and value = string array of sub-breed types (0 or more)
const flatten = (data: UnflattenedDogBreed): string[] => {
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
    // handle unsuccesful responses from API
    if (payload.status === 'error') {
      return {
        statusCode: payload.code,
        body: payload.message as string,
      }
    }

    // flatten response to single array of strings containing both breeds and sub-breeds
    const flatArrayOfBreeds = flatten(payload.message as UnflattenedDogBreed)
    return {
      statusCode: 200,
      body: flatArrayOfBreeds,
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Oops! Error Occurred',
    }
  }
}
