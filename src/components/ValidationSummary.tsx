import type { ExcelParsingError } from '../types/excel'
import './ValidationSummary.css'

interface ValidationSummaryProps {
  errors: ExcelParsingError[]
  warnings: string[]
  onRetry: () => void
  onContinue?: () => void
}

interface GroupedErrors {
  [sheetName: string]: ExcelParsingError[]
}

export function ValidationSummary({ errors, warnings, onRetry, onContinue }: ValidationSummaryProps) {
  // Group errors by sheet
  const groupedErrors: GroupedErrors = errors.reduce((acc, error) => {
    const sheetName = error.sheet || 'General'
    if (!acc[sheetName]) {
      acc[sheetName] = []
    }
    acc[sheetName].push(error)
    return acc
  }, {} as GroupedErrors)

  const hasErrors = errors.length > 0
  const hasWarnings = warnings.length > 0
  const sheetCount = Object.keys(groupedErrors).length

  const getTitle = (): string => {
    if (hasErrors) return 'Validation Issues Found'
    if (hasWarnings) return 'Validation Complete with Warnings'
    return 'Validation Successful'
  }

  const getSummaryText = (): string => {
    if (hasErrors) {
      const errorText = errors.length === 1 ? '1 error found' : `${errors.length} errors found`
      const sheetText = sheetCount === 1 ? '1 sheet' : `${sheetCount} sheets`
      return `${errorText} ${sheetCount > 0 ? `across ${sheetText}` : ''}`
    }
    
    if (hasWarnings) {
      return 'Data validation completed successfully, but some sheets had warnings.'
    }
    
    return 'All data has been validated successfully with no issues found.'
  }

  const getErrorIcon = (type: ExcelParsingError['type']): string => {
    switch (type) {
      case 'validation': return '⚠️'
      case 'parsing': return '🚫'
      case 'format': return '📄'
      default: return '❗'
    }
  }

  const formatErrorLocation = (error: ExcelParsingError): string => {
    if (error.row && error.column) {
      return `Row ${error.row}, Column ${error.column}:`
    }
    if (error.row) {
      return `Row ${error.row}:`
    }
    return 'Sheet Error:'
  }

  return (
    <div className="validation-summary">
      <div className={`summary-header ${hasErrors ? 'error' : hasWarnings ? 'warning' : 'success'}`}>
        <div className="summary-icon">
          {hasErrors ? '🚨' : hasWarnings ? '⚠️' : '✅'}
        </div>
        <div className="summary-content">
          <h2>{getTitle()}</h2>
          <p role="alert" aria-live="polite">
            {getSummaryText()}
            {hasWarnings && (
              <span className="warning-count">
                {warnings.length === 1 ? ', 1 warning' : `, ${warnings.length} warnings`}
              </span>
            )}
          </p>
        </div>
      </div>

      {hasErrors && (
        <div className="errors-section">
          <h3>Errors by Sheet</h3>
          {Object.entries(groupedErrors).map(([sheetName, sheetErrors]) => (
            <div key={sheetName} className="sheet-errors">
              <h4 className="sheet-title">
                {sheetName} ({sheetErrors.length === 1 ? '1 error' : `${sheetErrors.length} errors`})
              </h4>
              <ul className="error-list">
                {sheetErrors.map((error, index) => (
                  <li key={index} className={`error-item ${error.type}`}>
                    <span className="error-icon" aria-label={`${error.type} error`}>
                      {getErrorIcon(error.type)}
                    </span>
                    <div className="error-details">
                      <div className="error-location">{formatErrorLocation(error)}</div>
                      <div className="error-message">{error.message}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {hasWarnings && (
        <div className="warnings-section">
          <h3>Warnings</h3>
          <ul className="warning-list">
            {warnings.map((warning, index) => (
              <li key={index} className="warning-item">
                <span className="warning-icon" aria-label="warning">⚠️</span>
                <span className="warning-message">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="summary-actions">
        {hasErrors ? (
          <button 
            className="retry-button" 
            onClick={onRetry}
            aria-label="Try uploading a different file"
          >
            Try Different File
          </button>
        ) : (
          <>
            {hasWarnings && onContinue && (
              <button 
                className="continue-warning-button" 
                onClick={onContinue}
                aria-label="Continue despite warnings"
              >
                Continue Anyway
              </button>
            )}
            {!hasWarnings && onContinue && (
              <button 
                className="continue-button" 
                onClick={onContinue}
                aria-label="Continue to next step"
              >
                Continue
              </button>
            )}
          </>
        )}
      </div>

      {(hasErrors || hasWarnings) && (
        <div className="help-section">
          <h4>Need Help?</h4>
          <ul className="help-tips">
            <li>Ensure your Excel file has headers in the first row</li>
            <li>Required columns: Date, Description, Amount</li>
            <li>Dates should be in a recognizable format (YYYY-MM-DD, MM/DD/YYYY, etc.)</li>
            <li>Amounts should be numbers (negative for debits, positive for credits)</li>
            <li>Remove any summary or total rows from transaction sheets</li>
          </ul>
        </div>
      )}
    </div>
  )
}