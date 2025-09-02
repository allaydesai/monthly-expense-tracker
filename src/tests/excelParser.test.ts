import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as XLSX from 'xlsx'
import {
  parseExcelFile,
  extractTransactionsFromSheet,
  detectColumnMapping,
  parseExcelDate,
  validateTransactionData
} from '../utils/excelParser'
import type { ExcelSheet, Transaction, ColumnMapping } from '../types/excel'

// Mock XLSX
vi.mock('xlsx', () => ({
  read: vi.fn(),
  utils: {
    sheet_to_json: vi.fn(),
    decode_range: vi.fn(),
    encode_cell: vi.fn()
  }
}))

describe('Excel Parser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('parseExcelFile', () => {
    it('should parse a valid Excel file with multiple sheets', async () => {
      const mockWorkbook = {
        SheetNames: ['Checking', 'Savings', 'Summary'],
        Sheets: {
          'Checking': { '!ref': 'A1:C3', A1: { v: 'Date' }, B1: { v: 'Description' }, C1: { v: 'Amount' } },
          'Savings': { '!ref': 'A1:C2', A1: { v: 'Date' }, B1: { v: 'Description' }, C1: { v: 'Amount' } },
          'Summary': { '!ref': 'A1:A1', A1: { v: 'Total' } }
        }
      }

      vi.mocked(XLSX.read).mockReturnValue(mockWorkbook)
      vi.mocked(XLSX.utils.sheet_to_json)
        .mockReturnValueOnce([
          ['Date', 'Description', 'Amount'],
          ['2025-01-15', 'Grocery Store', -85.23],
          ['2025-01-16', 'Salary Deposit', 2500.00]
        ])
        .mockReturnValueOnce([
          ['Date', 'Description', 'Amount'],
          ['2025-01-14', 'Transfer', 1000.00]
        ])
        .mockReturnValueOnce([
          ['Total']
        ])

      const mockFile = {
        name: 'test.xlsx',
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0))
      } as unknown as File
      
      const result = await parseExcelFile(mockFile)

      expect(result.workbook.sheets).toHaveLength(3)
      expect(result.workbook.fileName).toBe('test.xlsx')
      expect(result.errors).toEqual([])
    })

    it('should handle parsing errors gracefully', async () => {
      // Create a proper mock File with arrayBuffer method
      const mockFile = {
        name: 'invalid.xlsx',
        arrayBuffer: vi.fn().mockRejectedValue(new Error('Invalid file format'))
      } as unknown as File
      
      const result = await parseExcelFile(mockFile)

      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].type).toBe('parsing')
      expect(result.errors[0].message).toContain('Invalid file format')
    })
  })

  describe('extractTransactionsFromSheet', () => {
    it('should extract transactions with correct column mapping', () => {
      const sheetData: ExcelSheet = {
        name: 'Checking',
        data: [
          ['Date', 'Description', 'Amount', 'Balance'],
          ['2025-01-15', 'Grocery Store', -85.23, 1500.00],
          ['2025-01-16', 'Salary Deposit', 2500.00, 4000.00]
        ],
        transactions: []
      }

      const columnMapping: ColumnMapping = {
        date: 'Date',
        description: 'Description',
        amount: 'Amount',
        balance: 'Balance'
      }

      const result = extractTransactionsFromSheet(sheetData, columnMapping)

      expect(result.transactions).toHaveLength(2)
      expect(result.transactions[0].description).toBe('Grocery Store')
      expect(result.transactions[0].amount).toBe(-85.23)
      expect(result.transactions[1].amount).toBe(2500.00)
    })

    it('should handle missing required columns', () => {
      const sheetData: ExcelSheet = {
        name: 'Incomplete',
        data: [
          ['Date', 'Description'],
          ['2025-01-15', 'Grocery Store']
        ],
        transactions: []
      }

      const columnMapping: ColumnMapping = {
        date: 'Date',
        description: 'Description',
        amount: 'Amount' // Missing in data
      }

      const result = extractTransactionsFromSheet(sheetData, columnMapping)

      expect(result.errors).toHaveLength(1)
      expect(result.errors[0].message).toContain('Required column "Amount" not found')
    })
  })

  describe('detectColumnMapping', () => {
    it('should detect common column patterns', () => {
      const headers = ['Transaction Date', 'Transaction Description', 'Debit Amount', 'Credit Amount', 'Account Balance']
      
      const mapping = detectColumnMapping(headers)

      expect(mapping.date).toBe('Transaction Date')
      expect(mapping.description).toBe('Transaction Description')
      expect(mapping.balance).toBe('Account Balance')
    })

    it('should handle case-insensitive matching', () => {
      const headers = ['DATE', 'DESCRIPTION', 'AMOUNT']
      
      const mapping = detectColumnMapping(headers)

      expect(mapping.date).toBe('DATE')
      expect(mapping.description).toBe('DESCRIPTION')
      expect(mapping.amount).toBe('AMOUNT')
    })
  })

  describe('parseExcelDate', () => {
    it('should parse Excel serial date numbers', () => {
      // Excel date serial number for 2025-01-14
      const excelSerial = 45671
      const result = parseExcelDate(excelSerial)
      
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(0) // January is 0
      expect(result.getDate()).toBe(14)
    })

    it('should parse text dates in various formats', () => {
      const textDate = '21 Aug 25'
      const result = parseExcelDate(textDate)
      
      expect(result.getFullYear()).toBe(2025)
      expect(result.getMonth()).toBe(7) // August is 7
      expect(result.getDate()).toBe(21)
    })

    it('should handle Date objects', () => {
      const dateObj = new Date('2025-01-15')
      const result = parseExcelDate(dateObj)
      
      expect(result).toEqual(dateObj)
    })

    it('should throw error for invalid dates', () => {
      expect(() => parseExcelDate('invalid date')).toThrow('Unable to parse date')
    })
  })

  describe('validateTransactionData', () => {
    it('should validate complete transaction data', () => {
      const transaction: Transaction = {
        date: new Date('2025-01-15'),
        description: 'Grocery Store',
        amount: -85.23,
        balance: 1500.00
      }

      const result = validateTransactionData(transaction, 1)

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should detect missing required fields', () => {
      const transaction: Partial<Transaction> = {
        date: new Date('2025-01-15'),
        description: '' // Empty description
        // Missing amount
      }

      const result = validateTransactionData(transaction as Transaction, 1)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
      expect(result.errors.some(e => e.message.includes('Description is required'))).toBe(true)
      expect(result.errors.some(e => e.message.includes('Amount is required'))).toBe(true)
    })

    it('should validate numeric amounts', () => {
      const transaction: Transaction = {
        date: new Date('2025-01-15'),
        description: 'Test Transaction',
        amount: NaN
      }

      const result = validateTransactionData(transaction, 1)

      expect(result.isValid).toBe(false)
      expect(result.errors.some(e => e.message.includes('Amount is required and must be a valid number'))).toBe(true)
    })
  })
})