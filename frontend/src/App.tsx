
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'

import {
  getApiErrorMessage,
  recognizeImage,
} from './api/imageApi'

import type {
  Prediction,
} from './api/imageApi'

import './App.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultFilename, setResultFilename] = useState<string | null>(null)

  // Release the browser's temporary image URL when it changes
  // or when the component is unmounted.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    // Validate the file type.
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      event.target.value = ''
      return
    }

    // Validate the file size.
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size must not exceed 10 MB.')
      event.target.value = ''
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setPredictions([])
    setResultFilename(null)
    setError(null)
  }

  async function handleRecognize() {
    if (!selectedFile || loading) {
      return
    }

    setLoading(true)
    setError(null)
    setPredictions([])
    setResultFilename(null)

    try {
      const result = await recognizeImage(selectedFile)

      setPredictions(result.predictions)
      setResultFilename(result.filename)
    } catch (err: unknown) {
      console.error('Image recognition failed:', err)
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">AI VISION</div>

        <h1>AI Image Recognition</h1>

        <p>
          Upload an image and discover what the AI model sees.
        </p>
      </header>

      <section className="upload-card">
        <label htmlFor="image-upload" className="upload-area">
          <span className="upload-icon" aria-hidden="true">
            ↑
          </span>

          <strong>Choose an image</strong>

          <span className="upload-description">
            Click to browse your files
          </span>

          <span className="upload-hint">
            Image files only · Maximum 10 MB
          </span>

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>

        {previewUrl && (
          <section className="preview">
            <div className="section-heading">
              <h2>Image Preview</h2>
              <span className="file-badge">Selected</span>
            </div>

            <img
              src={previewUrl}
              alt="Selected image preview"
            />

            <p className="filename">
              {selectedFile?.name}
            </p>
          </section>
        )}

        <button
          className="predict-button"
          type="button"
          disabled={!selectedFile || loading}
          onClick={handleRecognize}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Recognizing image...
            </>
          ) : (
            'Recognize Image'
          )}
        </button>

        {error && (
          <div className="error-message" role="alert">
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        )}

        {predictions.length > 0 && (
          <section className="results">
            <div className="section-heading">
              <h2>Recognition Results</h2>
              <span className="result-count">
                {predictions.length} predictions
              </span>
            </div>

            {resultFilename && (
              <p className="result-filename">
                Results for: {resultFilename}
              </p>
            )}

            {predictions.map((prediction) => {
              const percentage = Math.max(
                0,
                Math.min(100, prediction.confidence * 100),
              )

              return (
                <div
                  className="result-item"
                  key={prediction.rank}
                >
                  <div className="result-header">
                    <span className="result-label">
                      <span className="rank">
                        {prediction.rank}
                      </span>

                      {prediction.label}
                    </span>

                    <strong>
                      {percentage.toFixed(2)}%
                    </strong>
                  </div>

                  <div className="confidence-track">
                    <div
                      className="confidence-bar"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}

            <p className="result-note">
              Confidence scores are model predictions, not
              guaranteed probabilities of correctness.
            </p>
          </section>
        )}
      </section>

      <footer className="footer">
        Powered by React, FastAPI and Hugging Face ViT
      </footer>
    </main>
  )
}

export default App
