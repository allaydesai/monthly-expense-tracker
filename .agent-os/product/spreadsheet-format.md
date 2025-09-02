# Excel Spreadsheet Format Specification

## Overview

The Monthly Expense Tracker expects a specific Excel spreadsheet structure with multiple sheets representing different financial accounts and a summary overview.

## File Structure

```
August-2025-Spending.xlsx
├── Summary          # Account totals and budget overview
├── Checking         # Debit account transactions
├── RBC             # Credit card transactions
├── Amex            # Credit card transactions  
├── MBNA            # Credit card transactions (may be empty)
└── CapitalOne      # Credit card transactions
```

## Sheet Specifications

### Summary Sheet

**Purpose:** Provides account totals using Excel formulas that reference individual account sheets.

**Structure:**
- **Column A:** Account names (RBC, Checking, Amex, MBNA, CapitalOne)
- **Column B:** Formula-based totals (e.g., `=SUM(RBC!C2:C66)`)
- **Rows:** 2-9 containing account data

**Sample Data:**
```
Account     | Amount
RBC         | =SUM(RBC!C2:C66)
Checking    | =SUM(Checking!C2:C8)
Amex        | =SUM(Amex!C2:C22)
MBNA        | =SUM(MBNA!C2:C2)
CapitalOne  | =SUM(CapitalOne!C2:C4)
```

### Account Sheets (Transaction Data)

**Core Columns (Required):**
1. **Date** - Transaction date (various formats supported)
2. **Description** - Transaction description/merchant
3. **Amount** - Transaction amount (positive for expenses, negative for refunds/credits)

**Additional Columns:**
- May contain up to 13 columns total
- Extra columns are ignored during processing
- Empty columns/cells are handled gracefully

### Account-Specific Variations

#### Checking Account
- **Format:** Standard datetime objects
- **Rows:** Typically 2-9 transactions
- **Amount:** Positive values for expenses

**Sample:**
```
Date        | Description              | Amount
2025-08-19  | ATM withdrawal - House   | 300
2025-08-18  | lake shore cricket       | 395.5
2025-08-15  | HWY407 ETR              | 60.96
```

#### RBC Credit Card
- **Format:** Standard datetime objects
- **Rows:** High volume (2-63+ transactions)
- **Amount:** Positive values

**Sample:**
```
Date        | Description              | Amount
2025-08-25  | Nespresso Canada         | 30
2025-08-24  | Dosa and Biryani House   | 64.72
2025-08-24  | STARBUCKS               | 15.49
```

#### Amex Credit Card
- **Format:** Text-based dates with special characters (`\xa021 Aug 25`)
- **Rows:** Medium volume (2-23 transactions)
- **Amount:** Positive for charges, negative for refunds/credits

**Sample:**
```
Date        | Description              | Amount
 21 Aug 25  | PETRO-CANADA 30581      | 63.26
 19 Aug 25  | Billdesk*AMAZON MUM     | -18.8
 19 Aug 25  | Billdesk*AMAZON MUM     | -45.54
```

#### MBNA Credit Card
- **Format:** Standard structure (may be empty)
- **Rows:** May contain no transactions

#### CapitalOne Credit Card
- **Format:** Standard datetime objects
- **Rows:** Low volume (2-4 transactions)
- **Amount:** Positive values

**Sample:**
```
Date        | Description        | Amount
2025-08-06  | RAKHI.COM         | 36.52
2025-08-02  | Costco Canada     | 146.9
```

## Processing Requirements

### Data Validation
- Handle various date formats (datetime objects, text dates with special characters)
- Process positive and negative amounts correctly
- Skip empty rows and cells
- Validate against Summary sheet formula totals

### Error Handling
- Gracefully handle missing sheets
- Process sheets with varying column counts
- Handle formula-based cells in Summary sheet
- Auto-scale transaction totals if they don't match Summary formulas

### Data Transformation
- Normalize date formats to consistent format
- Categorize transactions using AI-powered classification
- Aggregate data across all accounts for unified dashboard view