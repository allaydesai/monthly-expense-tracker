import * as XLSX from 'xlsx'
import * as fs from 'fs'
import { parseExcelFile } from './utils/excelParser'

async function testExampleFile() {
  try {
    console.log('🔍 Testing example Excel file: August-2025-Spending.xlsx')
    console.log('=' .repeat(60))
    
    // Read the file
    const filePath = './example/August-2025-Spending.xlsx'
    const buffer = fs.readFileSync(filePath)
    
    // Create a File object from the buffer
    const file = new File([buffer], 'August-2025-Spending.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    // First, let's examine the raw structure with XLSX
    console.log('\n📊 Raw Excel File Analysis:')
    console.log('-'.repeat(30))
    
    const workbook = XLSX.read(buffer)
    console.log(`📋 Sheet Names: ${workbook.SheetNames.join(', ')}`)
    
    // Analyze each sheet
    for (const sheetName of workbook.SheetNames) {
      console.log(`\n📄 Sheet: "${sheetName}"`)
      const worksheet = workbook.Sheets[sheetName]
      
      if (!worksheet['!ref']) {
        console.log('  ⚠️  Empty sheet')
        continue
      }
      
      const range = XLSX.utils.decode_range(worksheet['!ref'])
      console.log(`  📐 Range: ${worksheet['!ref']} (${range.e.r + 1} rows, ${range.e.c + 1} columns)`)
      
      // Get first few rows to show structure
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 5 })
      console.log('  📝 First 5 rows:')
      jsonData.forEach((row: any[], index: number) => {
        console.log(`    Row ${index + 1}: [${row.join(', ')}]`)
      })
      
      // Try to identify headers
      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[]
        console.log(`  🏷️  Detected Headers: [${headers.join(', ')}]`)
      }
    }
    
    // Now test with our parser
    console.log('\n🚀 Testing with Our Excel Parser:')
    console.log('-'.repeat(40))
    
    const result = await parseExcelFile(file)
    
    console.log(`📁 File: ${result.workbook.fileName}`)
    console.log(`📊 Total Sheets: ${result.workbook.sheets.length}`)
    console.log(`💰 Total Transactions: ${result.workbook.totalTransactions}`)
    console.log(`❌ Errors: ${result.errors.length}`)
    console.log(`⚠️  Warnings: ${result.warnings.length}`)
    
    // Show each sheet's results
    result.workbook.sheets.forEach((sheet, index) => {
      console.log(`\n📄 Sheet ${index + 1}: "${sheet.name}"`)
      console.log(`  💳 Transactions: ${sheet.transactions.length}`)
      
      if (sheet.transactions.length > 0) {
        console.log('  📋 Sample Transactions:')
        sheet.transactions.slice(0, 3).forEach((tx, i) => {
          console.log(`    ${i + 1}. ${tx.date.toDateString()} | ${tx.description} | $${tx.amount}`)
        })
      }
    })
    
    // Show errors if any
    if (result.errors.length > 0) {
      console.log('\n❌ Parsing Errors:')
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.sheet}:${error.row}:${error.column}] ${error.message}`)
      })
    }
    
    // Show warnings if any
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:')
      result.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`)
      })
    }
    
    console.log('\n✅ Testing Complete!')
    
  } catch (error) {
    console.error('❌ Error testing file:', error)
  }
}

// Run the test
testExampleFile()