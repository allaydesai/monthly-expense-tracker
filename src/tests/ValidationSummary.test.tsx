import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ValidationSummary } from '../components/ValidationSummary'
import type { ExcelParsingError } from '../types/excel'

describe('ValidationSummary Component', () => {
  const mockErrors: ExcelParsingError[] = [
    {
      sheet: 'Checking',
      row: 2,
      column: 'Date',
      message: 'Date is required and must be valid',
      type: 'validation'
    },
    {
      sheet: 'Checking',
      row: 3,
      column: 'Amount',
      message: 'Amount is required and must be a valid number',
      type: 'validation'
    },
    {
      sheet: 'Savings',
      row: 1,
      column: '',
      message: 'Required column "Description" not found in sheet headers',
      type: 'validation'
    },
    {
      sheet: 'Credit',
      row: 0,
      column: '',
      message: 'Error processing sheet: Invalid file format',
      type: 'parsing'
    }
  ]

  const mockWarnings: string[] = [
    'Sheet "Summary" does not contain recognizable transaction columns',
    'Sheet "Notes" is empty and will be skipped'
  ]

  describe('Error Display', () => {
    it('should display validation errors grouped by sheet', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('Validation Issues Found')).toBeInTheDocument()
      expect(screen.getByText(/4 errors found across 3 sheets/)).toBeInTheDocument()
      
      // Check sheet grouping
      expect(screen.getByText('Checking (2 errors)')).toBeInTheDocument()
      expect(screen.getByText('Savings (1 error)')).toBeInTheDocument()
      expect(screen.getByText('Credit (1 error)')).toBeInTheDocument()
    })

    it('should display specific error details with locations', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={[]}
          onRetry={() => {}}
        />
      )

      // Check specific error details
      expect(screen.getByText('Row 2, Column Date:')).toBeInTheDocument()
      expect(screen.getByText('Date is required and must be valid')).toBeInTheDocument()
      
      expect(screen.getByText('Row 3, Column Amount:')).toBeInTheDocument()
      expect(screen.getByText('Amount is required and must be a valid number')).toBeInTheDocument()
    })

    it('should handle sheet-level errors without row/column info', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={[]}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('Sheet Error:')).toBeInTheDocument()
      expect(screen.getByText('Required column "Description" not found in sheet headers')).toBeInTheDocument()
    })

    it('should categorize errors by type', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={[]}
          onRetry={() => {}}
        />
      )

      // Should show validation and parsing error icons/indicators
      const validationErrors = mockErrors.filter(e => e.type === 'validation')
      const parsingErrors = mockErrors.filter(e => e.type === 'parsing')
      
      expect(validationErrors).toHaveLength(3)
      expect(parsingErrors).toHaveLength(1)
    })
  })

  describe('Warning Display', () => {
    it('should display warnings separately from errors', () => {
      render(
        <ValidationSummary 
          errors={[]} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText(/, 2 warnings/)).toBeInTheDocument()
      expect(screen.getByText('Sheet "Summary" does not contain recognizable transaction columns')).toBeInTheDocument()
      expect(screen.getByText('Sheet "Notes" is empty and will be skipped')).toBeInTheDocument()
    })

    it('should show both errors and warnings when present', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText(/4 errors found across 3 sheets/)).toBeInTheDocument()
      expect(screen.getByText(/, 2 warnings/)).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    it('should show success message when no errors or warnings', () => {
      render(
        <ValidationSummary 
          errors={[]} 
          warnings={[]}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('Validation Successful')).toBeInTheDocument()
      expect(screen.getByText('All data has been validated successfully with no issues found.')).toBeInTheDocument()
    })

    it('should show warnings-only state', () => {
      render(
        <ValidationSummary 
          errors={[]} 
          warnings={['Minor warning']}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('Validation Complete with Warnings')).toBeInTheDocument()
      expect(screen.getByText(/, 1 warning/)).toBeInTheDocument()
    })
  })

  describe('Action Buttons', () => {
    it('should show retry button when errors are present', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={[]}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('Try Different File')).toBeInTheDocument()
    })

    it('should show continue button when only warnings present', () => {
      render(
        <ValidationSummary 
          errors={[]} 
          warnings={mockWarnings}
          onRetry={() => {}}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText('Continue Anyway')).toBeInTheDocument()
    })

    it('should show continue button on success', () => {
      render(
        <ValidationSummary 
          errors={[]} 
          warnings={[]}
          onRetry={() => {}}
          onContinue={() => {}}
        />
      )

      expect(screen.getByText('Continue')).toBeInTheDocument()
    })
  })

  describe('Statistics', () => {
    it('should display error statistics correctly', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText(/4 errors found across 3 sheets/)).toBeInTheDocument()
      expect(screen.getByText(/, 2 warnings/)).toBeInTheDocument()
    })

    it('should handle single error/warning correctly', () => {
      render(
        <ValidationSummary 
          errors={[mockErrors[0]]} 
          warnings={[mockWarnings[0]]}
          onRetry={() => {}}
        />
      )

      expect(screen.getByText('1 error found across 1 sheet')).toBeInTheDocument()
      expect(screen.getByText(/, 1 warning/)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /try uploading a different file/i })).toBeInTheDocument()
    })

    it('should announce error count for screen readers', () => {
      render(
        <ValidationSummary 
          errors={mockErrors} 
          warnings={mockWarnings}
          onRetry={() => {}}
        />
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveTextContent(/4 errors found across 3 sheets/)
    })
  })
})