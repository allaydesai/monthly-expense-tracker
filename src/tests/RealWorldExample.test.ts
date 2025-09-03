import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as XLSX from 'xlsx'
import { parseExcelFile } from '../utils/excelParser'

describe('Real World Excel File Test', () => {
  it('should handle the example file correctly by directly testing the buffer', async () => {
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    
    console.log('Testing buffer directly with XLSX:')
    
    // Test direct XLSX reading
    const workbook = XLSX.read(buffer)
    console.log('Direct XLSX sheet names:', workbook.SheetNames)
    expect(workbook.SheetNames).toContain('Summary')
    expect(workbook.SheetNames).toContain('RBC') 
    expect(workbook.SheetNames).toContain('Amex')
    
    // Now test with a proper ArrayBuffer
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    
    // Create mock File with proper arrayBuffer method
    const mockFile = {
      name: 'August-2025-Spending.xlsx',
      size: buffer.length,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      arrayBuffer: async () => arrayBuffer
    } as File
    
    console.log('Testing with our parser:')
    const result = await parseExcelFile(mockFile)
    
    console.log('Parser results:', {
      fileName: result.workbook.fileName,
      sheetCount: result.workbook.sheets.length,
      sheetNames: result.workbook.sheets.map(s => s.name),
      totalTransactions: result.workbook.totalTransactions,
      errors: result.errors.length,
      warnings: result.warnings.length
    })
    
    expect(result.workbook.sheets.length).toBe(6)
    expect(result.workbook.sheets.map(s => s.name)).toEqual(['Summary', 'Checking', 'RBC', 'Amex', 'MBNA', 'CapitalOne'])
  })

  it('should parse specific sheet data correctly', async () => {
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    
    const mockFile = {
      name: 'August-2025-Spending.xlsx',
      size: buffer.length,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      arrayBuffer: async () => arrayBuffer
    } as File
    
    const result = await parseExcelFile(mockFile)
    
    // Find RBC sheet and validate its transactions
    const rbcSheet = result.workbook.sheets.find(s => s.name === 'RBC')
    expect(rbcSheet).toBeDefined()
    expect(rbcSheet!.transactions.length).toBeGreaterThan(50) // Should have many transactions
    
    // Check first transaction
    const firstTransaction = rbcSheet!.transactions[0]
    expect(firstTransaction.date).toBeInstanceOf(Date)
    expect(firstTransaction.description).toBeTruthy()
    expect(typeof firstTransaction.amount).toBe('number')
    
    console.log('Sample RBC transaction:', {
      date: firstTransaction.date.toDateString(),
      description: firstTransaction.description,
      amount: firstTransaction.amount
    })
    
    // Find Amex sheet and validate format handling
    const amexSheet = result.workbook.sheets.find(s => s.name === 'Amex')
    expect(amexSheet).toBeDefined()
    expect(amexSheet!.transactions.length).toBeGreaterThan(15)
    
    const amexTransaction = amexSheet!.transactions[0]
    console.log('Sample Amex transaction:', {
      date: amexTransaction.date.toDateString(), 
      description: amexTransaction.description,
      amount: amexTransaction.amount
    })
  })
})