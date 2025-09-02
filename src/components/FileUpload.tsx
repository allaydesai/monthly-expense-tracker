import React, { useState, useRef, useCallback } from 'react'
import { parseExcelFile } from '../utils/excelParser'
import type { ParsedExcelData } from '../types/excel'
import './FileUpload.css'

interface FileUploadProps {
  onFileProcessed: (data: ParsedExcelData) => void
  maxFileSize?: number // in bytes, default 10MB
}

interface UploadState {
  isDragOver: boolean
  isProcessing: boolean
  progress: number
  error: string | null
  fileName: string | null
}

const ACCEPTED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel' // .xls
]

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function FileUpload({ onFileProcessed, maxFileSize = DEFAULT_MAX_FILE_SIZE }: FileUploadProps) {
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    progress: 0,
    error: null,
    fileName: null
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      const extension = file.name.split('.').pop()?.toLowerCase()
      if (extension !== 'xlsx' && extension !== 'xls') {
        return 'Only Excel files (.xlsx, .xls) are supported'
      }
    }

    // Check file size
    if (file.size > maxFileSize) {
      const sizeMB = (maxFileSize / (1024 * 1024)).toFixed(1)
      return `File is too large. Maximum size is ${sizeMB}MB`
    }

    return null
  }, [maxFileSize])

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError, isProcessing: false }))
      return
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      error: null,
      fileName: file.name
    }))

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }))
      }, 100)

      const result = await parseExcelFile(file)

      clearInterval(progressInterval)
      setState(prev => ({ ...prev, progress: 100 }))

      // Brief delay to show 100% completion
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          progress: 0,
          fileName: null
        }))
        onFileProcessed(result)
      }, 500)

    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        progress: 0,
        error: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`
      }))
    }
  }, [validateFile, onFileProcessed])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    processFile(file)
  }, [processFile])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }, [handleFiles])

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    dragCounterRef.current += 1
    if (event.dataTransfer?.types?.includes('Files')) {
      setState(prev => ({ ...prev, isDragOver: true, error: null }))
    }
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) {
      setState(prev => ({ ...prev, isDragOver: false }))
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }, [])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    dragCounterRef.current = 0
    setState(prev => ({ ...prev, isDragOver: false }))
    
    handleFiles(event.dataTransfer.files)
  }, [handleFiles])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }, [handleClick])

  const getUploadZoneClassName = () => {
    const baseClass = 'upload-zone'
    const classes = [baseClass]
    
    if (state.isDragOver) classes.push('drag-hover')
    if (state.isProcessing) classes.push('processing')
    if (state.error) classes.push('error')
    
    return classes.join(' ')
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="file-upload">
      <div
        className={getUploadZoneClassName()}
        data-testid="upload-zone"
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        aria-label="Upload Excel file"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          className="file-input"
          aria-label="Upload Excel file"
        />
        
        <div className="upload-content">
          {state.isProcessing ? (
            <div className="processing-state">
              <div className="processing-icon">📊</div>
              <h3>Processing {state.fileName}</h3>
              <div className="progress-bar" role="progressbar" aria-valuenow={state.progress} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-fill" style={{ width: `${state.progress}%` }} />
              </div>
              <p className="progress-text">{state.progress}% complete</p>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📁</div>
              <h3>Drag and drop your Excel file here</h3>
              <p>or <span className="browse-link">click to browse</span></p>
              <div className="file-requirements">
                <p>Supported formats: .xlsx, .xls</p>
                <p>Maximum size: {formatFileSize(maxFileSize)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {state.error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠️</span>
          <span>{state.error}</span>
        </div>
      )}
    </div>
  )
}