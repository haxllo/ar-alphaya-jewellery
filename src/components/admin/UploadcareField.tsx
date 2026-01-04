'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import { FileUploaderRegular } from '@uploadcare/react-uploader'
import '@uploadcare/react-uploader/core.css'

// Using strict types or allowing partial matching
type Props = {
  path: string
  label?: string | Record<string, string> | false
  required?: boolean
  [key: string]: any // Allow other props passed by Payload
}

export const UploadcareField: React.FC<Props> = ({ path, label, required }) => {
  const { value, setValue } = useField<string>({ path })
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback((info: any) => {
    if (info && info.cdnUrl) {
      // Format: https://ucarecdn.com/UUID/
      // We want to store the full URL or just the UUID?
      // The current system uses full URLs mostly, or UUIDs. 
      // fix-uploadcare-url.ts handles both.
      // Let's store the full CDN URL.
      setValue(info.cdnUrl)
      setError(null)
    } else {
      console.error('Upload failed or cancelled', info)
    }
  }, [setValue])

  return (
    <div className="field-type text">
      <label className="field-label">
        {typeof label === 'string' ? label : 'Uploadcare Image'}
        {required && <span className="required">*</span>}
      </label>
      
      <div style={{ marginBottom: '10px' }}>
        <FileUploaderRegular
          pubkey="5eb856a1c841f37fa95c"
          imgOnly={true}
          multiple={false}
          onFileUploadSuccess={handleUpload}
          className="uc-w-full uc-h-full" // Basic styling class
        />
      </div>

      {value && (
        <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #eaeaea', borderRadius: '4px' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Current URL:</p>
          <input 
            type="text" 
            value={value} 
            readOnly 
            style={{ width: '100%', padding: '8px', background: '#f5f5f5', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
          <div style={{ marginTop: '10px' }}>
            {/* Simple preview */}
            <img 
              src={`${value}-/preview/200x200/`} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
            />
          </div>
          <button 
            type="button"
            onClick={() => setValue('')}
            style={{ marginTop: '10px', color: 'red', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            Remove Image
          </button>
        </div>
      )}

      {error && <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
    </div>
  )
}
