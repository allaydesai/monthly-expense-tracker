# Product Mission

## Pitch

Monthly Expense Tracker is a smart financial dashboard that helps individuals consolidate spending data from multiple bank accounts by providing AI-powered transaction categorization and personalized budget optimization insights.

## Users

### Primary Customers

- **Personal Finance Enthusiasts**: Individuals who actively track their expenses using Excel spreadsheets and want deeper insights
- **Multi-Account Users**: People with expenses across various banks who need a unified spending view

### User Personas

**Sarah, the Organized Spender** (28-45 years old)
- **Role:** Marketing Manager
- **Context:** Uses Excel to track monthly expenses across 3-4 bank accounts, wants insights before bank statements are available
- **Pain Points:** Manual categorization is time-consuming, hard to see spending patterns across accounts, lacks budget optimization guidance
- **Goals:** Quickly understand spending patterns, stay within budget, make informed financial decisions

**Michael, the Small Business Owner** (35-50 years old)
- **Role:** Freelance Consultant
- **Context:** Manages both personal and simple business expenses, needs quick financial overview for decision making
- **Pain Points:** Juggling multiple accounts, manual expense categorization, difficulty spotting overspending trends
- **Goals:** Streamline expense tracking, optimize spending, gain financial insights without complexity

## The Problem

### Manual Transaction Categorization is Time-Consuming

Most people spend 2-3 hours monthly categorizing transactions across multiple bank accounts. This manual process is error-prone and provides limited insights into spending patterns.

**Our Solution:** AI-powered categorization processes hundreds of transactions in minutes with 90%+ accuracy.

### Fragmented Financial View Across Multiple Accounts

Banking apps and statements show isolated account data, making it impossible to see the complete spending picture. Users struggle to understand their total financial position until monthly statements are available.

**Our Solution:** Unified dashboard consolidates all account data into a single, comprehensive spending overview.

### Lack of Actionable Budget Insights

Traditional expense tracking tools show what was spent but provide little guidance on optimization. Users can see they're over budget but don't know where to cut spending effectively.

**Our Solution:** AI-generated insights analyze spending patterns and provide specific, actionable recommendations for budget optimization.

## Differentiators

### Spreadsheet-First Approach

Unlike banking apps that require direct account linking, we work with familiar Excel spreadsheets. This provides immediate data control, works before statements are available, and requires no sensitive banking credentials.

### AI-Powered Intelligence Without Complexity

Unlike complex financial software, we provide sophisticated AI categorization and insights through a simple interface. Users get enterprise-level analytics with consumer-friendly usability.

### Privacy-First Architecture

Unlike cloud-based financial tools that store sensitive data, we process everything locally using your own API keys. Your financial data never leaves your device, ensuring complete privacy control.

## Key Features

### Core Features

- **Excel File Processing:** Seamlessly imports multi-sheet Excel files following specific format:
  - **Summary Sheet**: Account names with formula-based totals (=SUM(AccountName!C2:CX))
  - **Account Sheets**: Individual bank accounts (Checking, RBC, Amex, MBNA, CapitalOne) with Date, Description, Amount columns
  - **Data Validation**: Handles various date formats, positive/negative amounts, and empty rows
- **Multi-Account Transaction Parsing:** Processes 5+ account types including:
  - **Debit Accounts**: Checking account with transaction history
  - **Credit Cards**: RBC, Amex, MBNA, CapitalOne with varying date formats and negative amounts for refunds
  - **Flexible Column Handling**: Accommodates extra columns beyond core Date/Description/Amount structure
- **AI Transaction Categorization:** Intelligently categorizes transactions using OpenAI API into 11 predefined spending categories
- **Budget Summary Integration:** Cross-validates transaction totals against Summary sheet formulas (=SUM(SheetName!C2:CX)) with automatic scaling adjustments for data discrepancies
- **Unified Dashboard:** Consolidates spending data from multiple accounts into a single, comprehensive view

### Analytics Features

- **Visual Spending Charts:** Interactive pie charts, bar graphs, and trend lines showing spending patterns by category and account
- **Daily Spending Trends:** 14-day spending visualization to identify daily spending patterns
- **Category Analysis:** Detailed breakdown of spending percentages and amounts across all categories
- **Account Comparison:** Side-by-side analysis of spending across different bank accounts

### Insight Features

- **AI Budget Optimization:** Personalized recommendations for reducing spending and staying within budget
- **Spending Pattern Recognition:** Identifies trends like dining frequency, shopping habits, and seasonal spending
- **Over-Budget Alerts:** Immediate visual feedback when spending exceeds budget categories
- **Transaction Search & Filter:** Advanced filtering and search capabilities across all transactions