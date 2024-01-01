'use client'
import { useState, useRef } from 'react'

const dashboard = () => {
  return (
    <div>
      <p>Welcome to Home page 🚀 </p>
      <AvatarUploadPage />
    </div>
  )
}

export default dashboard

function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [blob, setBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  return (
    <>
      <h1>Upload Your Avatar</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault()

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected')
          }

          setLoading(true)

          const file = inputFileRef.current.files[0]

          const response = await fetch(
            `/api/instant/invoice?filename=${file.name}`,
            {
              method: 'POST',
              body: file,
              headers: {
                'Content-Type': file.type
              }
            }
          )

          const newBlob = await response.json()
          console.log(newBlob)

          setBlob(newBlob.data.url)
          setLoading(false)
        }}
      >
        <input name='file' ref={inputFileRef} type='file' required />
        <button disabled={loading} type='submit'>
          Upload
        </button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob}>{blob}</a>
        </div>
      )}
    </>
  )
}
