
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8001',
  timeout: 60000,
})

export interface Prediction {
  rank: number
  label: string
  confidence: number
}

export interface PredictionResponse {
  filename: string
  predictions: Prediction[]
}

export async function recognizeImage(
  file: File,
): Promise<PredictionResponse> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await apiClient.post<PredictionResponse>(
    '/predict',
    formData,
  )

  return response.data
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const detail = error.response.data?.detail

      if (typeof detail === 'string') {
        return detail
      }

      return `Server returned status ${error.response.status}.`
    }

    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.'
    }

    return 'Cannot connect to the backend. Please check whether the API is running.'
  }

  return 'An unexpected error occurred.'
}
