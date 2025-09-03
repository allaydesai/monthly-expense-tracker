export interface Transaction {
  date: Date
  description: string
  amount: number
  balance?: number
  category?: string
  account?: string
}

export interface ExcelSheet {
  name: string
  data: unknown[][]
  transactions: Transaction[]
}

export interface ExcelWorkbook {
  sheets: ExcelSheet[]
  fileName: string
  totalTransactions: number
}

export interface ParsedExcelData {
  workbook: ExcelWorkbook
  errors: ExcelParsingError[]
  warnings: string[]
}

export interface ExcelParsingError {
  sheet: string
  row: number
  column: string
  message: string
  type: 'validation' | 'parsing' | 'format'
}

export interface ColumnMapping {
  date: string
  description: string
  amount: string
  balance?: string
}

// Commented out unused interface - can be used for future enhancements
// export interface SheetConfig {
//   hasHeaders: boolean
//   startRow: number
//   columnMapping: ColumnMapping
// }