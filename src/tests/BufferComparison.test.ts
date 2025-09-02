import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as XLSX from 'xlsx'

describe('Buffer Comparison Test', () => {
  it('should compare direct buffer vs File constructor buffer', async () => {
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    
    console.log('Original buffer first 20 bytes:', Array.from(buffer.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '))
    
    // Direct XLSX read
    const directWorkbook = XLSX.read(buffer)
    console.log('Direct read sheet names:', directWorkbook.SheetNames)
    
    // Via File constructor
    const file = new File([buffer], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // Add arrayBuffer method that returns the proper buffer
    Object.defineProperty(file, 'arrayBuffer', {
      value: async () => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
      writable: false
    })
    
    const fileArrayBuffer = await file.arrayBuffer()
    console.log('File ArrayBuffer first 20 bytes:', Array.from(new Uint8Array(fileArrayBuffer).slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '))
    
    const fileWorkbook = XLSX.read(fileArrayBuffer)
    console.log('File read sheet names:', fileWorkbook.SheetNames)
    
    // Try with new Uint8Array(buffer) approach
    const directArrayBuffer = new Uint8Array(buffer).buffer
    console.log('Direct Uint8Array first 20 bytes:', Array.from(new Uint8Array(directArrayBuffer).slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' '))
    
    const directWorkbook2 = XLSX.read(directArrayBuffer)
    console.log('Direct Uint8Array read sheet names:', directWorkbook2.SheetNames)
    
    expect(directWorkbook.SheetNames).toHaveLength(6)
    expect(directWorkbook2.SheetNames).toHaveLength(6)
  })
})