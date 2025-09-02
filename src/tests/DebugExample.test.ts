import { describe, it, expect, vi } from 'vitest'
import * as fs from 'fs'
import { parseExcelFile } from '../utils/excelParser'

describe('Debug Example File', () => {
  it('should debug file parsing', async () => {
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    
    console.log('Buffer length:', buffer.length)
    
    const file = new File([buffer], 'August-2025-Spending.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    console.log('File object:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Mock arrayBuffer to return the buffer
    vi.spyOn(file, 'arrayBuffer').mockResolvedValue(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength))
    
    const result = await parseExcelFile(file)
    
    console.log('Parse result:', {
      fileName: result.workbook.fileName,
      sheetsCount: result.workbook.sheets.length,
      totalTransactions: result.workbook.totalTransactions,
      errorsCount: result.errors.length,
      warningsCount: result.warnings.length
    })

    if (result.workbook.sheets.length > 0) {
      console.log('First sheet:', {
        name: result.workbook.sheets[0].name,
        transactions: result.workbook.sheets[0].transactions.length
      })
    }

    expect(result.workbook.sheets.length).toBeGreaterThan(0)
  })
})