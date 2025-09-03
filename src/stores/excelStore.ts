import { create } from 'zustand'
import type { ParsedExcelData, ExcelWorkbook, ExcelParsingError } from '../types/excel'

export interface UploadState {
  status: 'idle' | 'uploading' | 'parsing' | 'complete' | 'error'
  progress: number
  fileName: string | null
  fileSize: number | null
  startTime: number | null
}

export interface ExcelStoreState {
  // Upload state
  upload: UploadState
  
  // Parsed data
  workbook: ExcelWorkbook | null
  errors: ExcelParsingError[]
  warnings: string[]
  
  // UI state
  showValidationSummary: boolean
  
  // Actions
  setUploadState: (state: Partial<UploadState>) => void
  setParsingResults: (data: ParsedExcelData) => void
  clearData: () => void
  showValidation: () => void
  hideValidation: () => void
}

const initialUploadState: UploadState = {
  status: 'idle',
  progress: 0,
  fileName: null,
  fileSize: null,
  startTime: null
}

export const useExcelStore = create<ExcelStoreState>((set, get) => ({
  // Initial state
  upload: initialUploadState,
  workbook: null,
  errors: [],
  warnings: [],
  showValidationSummary: false,
  
  // Actions
  setUploadState: (newState) => 
    set((state) => ({
      upload: { ...state.upload, ...newState }
    })),
  
  setParsingResults: (data) => 
    set({
      workbook: data.workbook,
      errors: data.errors,
      warnings: data.warnings,
      showValidationSummary: true,
      upload: { ...get().upload, status: 'complete', progress: 100 }
    }),
  
  clearData: () => 
    set({
      upload: initialUploadState,
      workbook: null,
      errors: [],
      warnings: [],
      showValidationSummary: false
    }),
  
  showValidation: () => set({ showValidationSummary: true }),
  hideValidation: () => set({ showValidationSummary: false })
}))