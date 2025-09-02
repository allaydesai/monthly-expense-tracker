import { FileUpload } from './components/FileUpload'
import { ValidationSummary } from './components/ValidationSummary'
import { useExcelStore } from './stores/excelStore'
import './App.css'

function App() {
  const { 
    workbook, 
    errors, 
    warnings, 
    showValidationSummary,
    setParsingResults,
    clearData,
    hideValidation
  } = useExcelStore()

  const handleFileProcessed = (data: any) => {
    setParsingResults(data)
  }

  const handleRetry = () => {
    clearData()
  }

  const handleContinue = () => {
    hideValidation()
    // In a real app, this would navigate to the next step
    console.log('Continuing with:', workbook)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Monthly Expense Tracker</h1>
        <p>Upload your Excel expense files to get started</p>
      </header>
      
      <main className="App-main">
        {!showValidationSummary ? (
          <FileUpload onFileProcessed={handleFileProcessed} />
        ) : (
          <ValidationSummary 
            errors={errors}
            warnings={warnings}
            onRetry={handleRetry}
            onContinue={handleContinue}
          />
        )}
        
        {workbook && !showValidationSummary && (
          <div className="success-message">
            <h2>✅ Upload Successful!</h2>
            <p>
              Processed {workbook.totalTransactions} transactions 
              from {workbook.sheets.length} sheets in "{workbook.fileName}"
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App