import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import { parseExcelFile } from '../utils/excelParser'

describe('Example File Integration Test - August-2025-Spending.xlsx', () => {
  const getExampleFile = () => {
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    
    // Create a File object that works in Node.js test environment
    const file = new File([buffer], 'August-2025-Spending.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    // Add arrayBuffer method for test environment compatibility
    if (!file.arrayBuffer) {
      Object.defineProperty(file, 'arrayBuffer', {
        value: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
        writable: false
      })
    }
    
    return file
  }

  it('should successfully parse the example Excel file', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    expect(result.workbook.fileName).toBe('August-2025-Spending.xlsx')
    expect(result.workbook.sheets).toHaveLength(6)
    expect(result.workbook.totalTransactions).toBe(91)
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(1)
  })

  it('should correctly identify sheet names and types', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    const sheetNames = result.workbook.sheets.map(s => s.name)
    expect(sheetNames).toEqual(['Summary', 'Checking', 'RBC', 'Amex', 'MBNA', 'CapitalOne'])

    // Summary sheet should be identified as non-transaction sheet
    const summarySheet = result.workbook.sheets.find(s => s.name === 'Summary')
    expect(summarySheet?.transactions).toHaveLength(0)

    // Transaction sheets should have transactions
    const rbcSheet = result.workbook.sheets.find(s => s.name === 'RBC')
    expect(rbcSheet?.transactions.length).toBeGreaterThan(0)
    
    const amexSheet = result.workbook.sheets.find(s => s.name === 'Amex')
    expect(amexSheet?.transactions.length).toBeGreaterThan(0)
  })

  it('should handle different date formats correctly', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    const amexSheet = result.workbook.sheets.find(s => s.name === 'Amex')
    
    // Amex sheet uses format like " 17 Aug 25"
    expect(amexSheet?.transactions[0].date.getFullYear()).toBe(2025)
    expect(amexSheet?.transactions[0].date.getMonth()).toBe(7) // August is month 7 (0-indexed)

    const rbcSheet = result.workbook.sheets.find(s => s.name === 'RBC') 
    
    // RBC sheet uses Excel serial numbers
    expect(rbcSheet?.transactions[0].date.getFullYear()).toBe(2025)
    expect(rbcSheet?.transactions[0].date.getMonth()).toBe(7) // August
  })

  it('should parse transaction amounts correctly', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    const rbcSheet = result.workbook.sheets.find(s => s.name === 'RBC')
    expect(rbcSheet?.transactions[0].amount).toBeTypeOf('number')
    expect(rbcSheet?.transactions[0].amount).toBeGreaterThan(0)

    const amexSheet = result.workbook.sheets.find(s => s.name === 'Amex')
    expect(amexSheet?.transactions[0].amount).toBeTypeOf('number')

    // Check for negative amounts (refunds/credits)
    const negativeTransaction = amexSheet?.transactions.find(t => t.amount < 0)
    expect(negativeTransaction).toBeDefined()
  })

  it('should extract meaningful transaction descriptions', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    const rbcSheet = result.workbook.sheets.find(s => s.name === 'RBC')
    const sampleTransaction = rbcSheet?.transactions[0]
    
    expect(sampleTransaction?.description).toBeTruthy()
    expect(sampleTransaction?.description.length).toBeGreaterThan(0)

    const amexSheet = result.workbook.sheets.find(s => s.name === 'Amex')
    const amexTransaction = amexSheet?.transactions[0]
    
    expect(amexTransaction?.description).toBeTruthy()
    expect(amexTransaction?.description.length).toBeGreaterThan(0)
  })

  it('should handle mixed data quality gracefully', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    // MBNA sheet appears to have minimal data
    const mbnaSheet = result.workbook.sheets.find(s => s.name === 'MBNA')
    expect(mbnaSheet?.transactions).toHaveLength(0)

    // CapitalOne has some data
    const capitalOneSheet = result.workbook.sheets.find(s => s.name === 'CapitalOne')
    expect(capitalOneSheet?.transactions.length).toBeGreaterThan(0)
  })

  it('should provide appropriate warnings for summary sheets', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    expect(result.warnings).toHaveLength(1)
    expect(result.warnings[0]).toContain('Summary')
    expect(result.warnings[0]).toContain('not contain recognizable transaction columns')
  })

  it('should validate transaction data integrity', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    // All transactions should have valid dates
    result.workbook.sheets.forEach(sheet => {
      sheet.transactions.forEach(transaction => {
        expect(transaction.date).toBeInstanceOf(Date)
        expect(transaction.date.getTime()).not.toBeNaN()
        expect(transaction.description).toBeTruthy()
        expect(transaction.amount).toBeTypeOf('number')
        expect(transaction.amount).not.toBeNaN()
      })
    })
  })

  it('should demonstrate real-world parsing capabilities', async () => {
    const file = getExampleFile()
    const result = await parseExcelFile(file)

    // Summary of what was successfully parsed
    const transactionSummary = result.workbook.sheets.map(sheet => ({
      name: sheet.name,
      count: sheet.transactions.length,
      totalAmount: sheet.transactions.reduce((sum, t) => sum + t.amount, 0)
    }))

    console.log('\n📊 Parsing Summary:')
    console.log('=' .repeat(40))
    transactionSummary.forEach(summary => {
      if (summary.count > 0) {
        console.log(`${summary.name}: ${summary.count} transactions, $${summary.totalAmount.toFixed(2)}`)
      }
    })

    // Validate we got substantial data
    const totalParsedTransactions = transactionSummary.reduce((sum, s) => sum + s.count, 0)
    expect(totalParsedTransactions).toBeGreaterThan(80) // Should parse most transactions

    // Validate we got transactions from multiple sheets
    const sheetsWithTransactions = transactionSummary.filter(s => s.count > 0)
    expect(sheetsWithTransactions.length).toBeGreaterThanOrEqual(4) // At least 4 account sheets
  })
})