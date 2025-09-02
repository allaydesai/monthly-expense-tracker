import * as XLSX from 'xlsx'
import { getArrayBufferFromFile } from './fileHelpers'
import type {
  Transaction,
  ExcelSheet,
  ExcelWorkbook,
  ParsedExcelData,
  ExcelParsingError,
  ColumnMapping
} from '../types/excel'

/**
 * Parse an Excel file and extract transaction data from all sheets
 */
export async function parseExcelFile(file: File): Promise<ParsedExcelData> {
  const errors: ExcelParsingError[] = []
  const warnings: string[] = []

  try {
    // Read file as array buffer
    const arrayBuffer = await getArrayBufferFromFile(file)
    
    // Convert ArrayBuffer to Uint8Array for XLSX compatibility
    const uint8Array = new Uint8Array(arrayBuffer)
    
    const workbook = XLSX.read(uint8Array, { type: 'array' })

    const sheets: ExcelSheet[] = []
    let totalTransactions = 0

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      try {
        const worksheet = workbook.Sheets[sheetName]
        
        // Skip empty sheets
        if (!worksheet || !worksheet['!ref']) {
          warnings.push(`Sheet "${sheetName}" is empty and will be skipped`)
          continue
        }

        // Convert sheet to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        if (jsonData.length === 0) {
          warnings.push(`Sheet "${sheetName}" contains no data`)
          continue
        }

        const sheet: ExcelSheet = {
          name: sheetName,
          data: jsonData as unknown[][],
          transactions: []
        }

        // Detect column mapping
        const headers = jsonData[0] as string[]
        const columnMapping = detectColumnMapping(headers)

        // Extract transactions if this looks like a transaction sheet
        if (columnMapping.date && columnMapping.description && columnMapping.amount) {
          const sheetResult = extractTransactionsFromSheet(sheet, columnMapping)
          sheet.transactions = sheetResult.transactions
          errors.push(...sheetResult.errors)
          totalTransactions += sheetResult.transactions.length
        } else {
          warnings.push(`Sheet "${sheetName}" does not contain recognizable transaction columns`)
        }

        sheets.push(sheet)
      } catch (error) {
        errors.push({
          sheet: sheetName,
          row: 0,
          column: '',
          message: `Error processing sheet: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'parsing'
        })
      }
    }

    const excelWorkbook: ExcelWorkbook = {
      sheets,
      fileName: file.name,
      totalTransactions
    }

    return {
      workbook: excelWorkbook,
      errors,
      warnings
    }
  } catch (error) {
    return {
      workbook: {
        sheets: [],
        fileName: file.name,
        totalTransactions: 0
      },
      errors: [{
        sheet: '',
        row: 0,
        column: '',
        message: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'parsing'
      }],
      warnings
    }
  }
}

/**
 * Extract transactions from a single sheet
 */
export function extractTransactionsFromSheet(
  sheet: ExcelSheet, 
  columnMapping: ColumnMapping
): { transactions: Transaction[], errors: ExcelParsingError[] } {
  const transactions: Transaction[] = []
  const errors: ExcelParsingError[] = []

  // Validate that required columns exist
  const headers = sheet.data[0] as string[]
  const requiredColumns = ['date', 'description', 'amount'] as const
  
  for (const col of requiredColumns) {
    if (!headers.includes(columnMapping[col])) {
      errors.push({
        sheet: sheet.name,
        row: 1,
        column: columnMapping[col],
        message: `Required column "${columnMapping[col]}" not found in sheet headers`,
        type: 'validation'
      })
    }
  }

  if (errors.length > 0) {
    return { transactions, errors }
  }

  // Find column indices
  const dateIndex = headers.indexOf(columnMapping.date)
  const descriptionIndex = headers.indexOf(columnMapping.description)
  const amountIndex = headers.indexOf(columnMapping.amount)
  const balanceIndex = columnMapping.balance ? headers.indexOf(columnMapping.balance) : -1

  // Process data rows (skip header)
  for (let rowIndex = 1; rowIndex < sheet.data.length; rowIndex++) {
    const row = sheet.data[rowIndex]
    
    try {
      // Skip empty rows
      if (!row || row.every(cell => !cell && cell !== 0)) {
        continue
      }

      const rawDate = row[dateIndex]
      const rawDescription = row[descriptionIndex]
      const rawAmount = row[amountIndex]
      const rawBalance = balanceIndex >= 0 ? row[balanceIndex] : undefined

      // Parse transaction data
      const transaction: Transaction = {
        date: parseExcelDate(rawDate),
        description: String(rawDescription || '').trim(),
        amount: parseAmount(rawAmount)
      }

      if (rawBalance !== undefined) {
        transaction.balance = parseAmount(rawBalance)
      }

      // Validate transaction
      const validation = validateTransactionData(transaction, rowIndex + 1)
      
      if (validation.isValid) {
        transactions.push(transaction)
      } else {
        errors.push(...validation.errors.map(error => ({
          ...error,
          sheet: sheet.name
        })))
      }
    } catch (error) {
      errors.push({
        sheet: sheet.name,
        row: rowIndex + 1,
        column: '',
        message: `Error processing row: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'parsing'
      })
    }
  }

  return { transactions, errors }
}

/**
 * Detect column mapping based on header names
 */
export function detectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: Partial<ColumnMapping> = {}

  // Normalize headers for matching
  const normalizedHeaders = headers.map(h => String(h || '').toLowerCase().trim())

  // Date column patterns
  const datePatterns = ['date', 'transaction date', 'trans date', 'posting date', 'value date']
  for (const pattern of datePatterns) {
    const index = normalizedHeaders.findIndex(h => h.includes(pattern))
    if (index >= 0) {
      mapping.date = headers[index]
      break
    }
  }

  // Description column patterns
  const descriptionPatterns = ['description', 'transaction description', 'details', 'memo', 'reference', 'particulars']
  for (const pattern of descriptionPatterns) {
    const index = normalizedHeaders.findIndex(h => h.includes(pattern))
    if (index >= 0) {
      mapping.description = headers[index]
      break
    }
  }

  // Amount column patterns - handle both single amount and debit/credit
  const amountPatterns = ['amount', 'transaction amount', 'debit', 'credit', 'withdrawal', 'deposit']
  for (const pattern of amountPatterns) {
    const index = normalizedHeaders.findIndex(h => h.includes(pattern))
    if (index >= 0) {
      mapping.amount = headers[index]
      break
    }
  }

  // Balance column patterns
  const balancePatterns = ['balance', 'account balance', 'running balance', 'available balance']
  for (const pattern of balancePatterns) {
    const index = normalizedHeaders.findIndex(h => h.includes(pattern))
    if (index >= 0) {
      mapping.balance = headers[index]
      break
    }
  }

  return mapping as ColumnMapping
}

/**
 * Parse Excel date values (handles serial numbers, text dates, and Date objects)
 */
export function parseExcelDate(value: unknown): Date {
  if (!value && value !== 0) {
    throw new Error('Date value is required')
  }

  // Handle Date objects
  if (value instanceof Date) {
    return value
  }

  // Handle Excel serial numbers
  if (typeof value === 'number') {
    // Excel date serial numbers start from 1900-01-01
    // Excel serial number 1 = 1900-01-01, but we need to account for Excel's leap year bug
    const excelBaseDate = new Date(1899, 11, 30) // Dec 30, 1899
    return new Date(excelBaseDate.getTime() + value * 24 * 60 * 60 * 1000)
  }

  // Handle text dates
  if (typeof value === 'string') {
    const dateStr = value.trim()
    
    // Try various date formats
    const formats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}\/\d{2}\/\d{2}$/, // MM/DD/YY
      /^\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4}$/ // DD MMM YYYY or DD MMM YY
    ]

    for (const format of formats) {
      if (format.test(dateStr)) {
        const parsed = new Date(dateStr)
        if (!isNaN(parsed.getTime())) {
          // Handle 2-digit years
          if (parsed.getFullYear() < 100) {
            parsed.setFullYear(parsed.getFullYear() + (parsed.getFullYear() < 50 ? 2000 : 1900))
          }
          return parsed
        }
      }
    }

    // Try parsing with special handling for formats like "21 Aug 25"
    const specialFormat = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{2})$/)
    if (specialFormat) {
      const [, day, month, year] = specialFormat
      const monthMap: { [key: string]: number } = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
      }
      const monthIndex = monthMap[month.toLowerCase()]
      if (monthIndex !== undefined) {
        const fullYear = parseInt(year) + 2000
        return new Date(fullYear, monthIndex, parseInt(day))
      }
    }
  }

  throw new Error(`Unable to parse date: ${value}`)
}

/**
 * Parse amount values (handles numbers, strings, and formulas)
 */
function parseAmount(value: unknown): number {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    // Remove currency symbols and whitespace
    const cleaned = value.replace(/[$,\s]/g, '').trim()
    
    // Handle parentheses as negative
    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
      const amount = parseFloat(cleaned.slice(1, -1))
      return isNaN(amount) ? 0 : -amount
    }

    const amount = parseFloat(cleaned)
    return isNaN(amount) ? 0 : amount
  }

  return 0
}

/**
 * Validate transaction data
 */
export function validateTransactionData(
  transaction: Transaction, 
  rowNumber: number
): { isValid: boolean, errors: ExcelParsingError[] } {
  const errors: ExcelParsingError[] = []

  // Validate date
  if (!transaction.date || isNaN(transaction.date.getTime())) {
    errors.push({
      sheet: '',
      row: rowNumber,
      column: 'date',
      message: 'Date is required and must be valid',
      type: 'validation'
    })
  }

  // Validate description
  if (!transaction.description || transaction.description.trim().length === 0) {
    errors.push({
      sheet: '',
      row: rowNumber,
      column: 'description',
      message: 'Description is required',
      type: 'validation'
    })
  }

  // Validate amount
  if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
    errors.push({
      sheet: '',
      row: rowNumber,
      column: 'amount',
      message: 'Amount is required and must be a valid number',
      type: 'validation'
    })
  }

  // Validate balance if provided
  if (transaction.balance !== undefined && (typeof transaction.balance !== 'number' || isNaN(transaction.balance))) {
    errors.push({
      sheet: '',
      row: rowNumber,
      column: 'balance',
      message: 'Balance must be a valid number if provided',
      type: 'validation'
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}