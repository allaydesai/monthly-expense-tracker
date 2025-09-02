# Monthly Expense Tracker

A smart financial dashboard that helps individuals consolidate spending data from multiple bank accounts by providing AI-powered transaction categorization and personalized budget optimization insights.

## 🚀 Features

### ✅ Excel File Upload and Parsing (Completed)
- **Multi-Sheet Processing**: Handles complex Excel files with multiple transaction sheets
- **Intelligent Column Detection**: Automatically maps transaction fields across different bank formats
- **Drag-and-Drop Upload**: Intuitive file upload interface with real-time progress
- **Comprehensive Validation**: Validates dates, amounts, and required fields with detailed error reporting
- **Error Recovery**: User-friendly error messages with actionable guidance
- **Accessibility**: Full WCAG compliance with keyboard navigation and screen reader support

### 🔄 Planned Features
- AI-powered transaction categorization using OpenAI API
- Personalized budget optimization insights
- Multi-account consolidation dashboard
- Export capabilities (PDF, CSV)
- Data visualization and spending trends

## 🛠️ Technical Stack

- **Frontend**: React 18.2+ with TypeScript 5.0+
- **Build Tool**: Vite 5.0+ with hot module replacement
- **Excel Processing**: SheetJS (xlsx) for multi-sheet parsing
- **State Management**: Zustand 4.4+
- **Testing**: Vitest with React Testing Library
- **Styling**: CSS3 with responsive design
- **File Processing**: Local-only (privacy-first approach)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── FileUpload.tsx   # Drag-and-drop upload interface
│   └── ValidationSummary.tsx # Error/validation reporting
├── stores/              # Zustand state management
│   └── excelStore.ts    # Excel processing state
├── utils/               # Utility functions
│   └── excelParser.ts   # Excel parsing and validation logic
├── types/               # TypeScript type definitions
│   └── excel.ts         # Excel-related interfaces
└── tests/               # Test suites
    ├── excelParser.test.ts
    ├── FileUpload.test.tsx
    └── ValidationSummary.test.tsx
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd monthly-expense-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Usage

1. **Upload Excel File**: Drag and drop or click to select your Excel expense file (.xlsx, .xls)
2. **Automatic Processing**: The system will parse all sheets and detect transaction columns
3. **Validation Review**: Review any validation errors or warnings with specific locations
4. **Data Confirmation**: Confirm processed data before proceeding to categorization

## 🧪 Testing

The project includes comprehensive test coverage:

- **44 passing tests** across all components
- **Unit tests** for Excel parsing logic
- **Component tests** for React UI components
- **Integration tests** for complete workflows

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- FileUpload.test.tsx
```

## 🎯 Excel File Requirements

### Supported Formats
- `.xlsx` (Excel 2007+)
- `.xls` (Excel 97-2003)

### Required Columns
- **Date**: Transaction date in any standard format
- **Description**: Transaction description or merchant name
- **Amount**: Transaction amount (negative for debits, positive for credits)

### Optional Columns
- **Balance**: Running account balance
- **Category**: Transaction category (will be auto-categorized if missing)

### File Structure Tips
- Include headers in the first row
- Use consistent date formats within each sheet
- Remove summary or total rows from transaction data
- Multiple sheets are supported (one per account)

## 🔒 Privacy & Security

- **Local Processing**: All Excel files are processed locally in the browser
- **No Data Upload**: Files never leave your device during processing
- **Privacy-First**: Complete control over your financial data
- **Secure**: No server-side storage or external data sharing

## 📊 Architecture Highlights

### Excel Processing Pipeline
1. **File Validation**: MIME type and size checking
2. **Sheet Detection**: Automatic identification of transaction sheets
3. **Column Mapping**: Intelligent detection of transaction fields
4. **Data Extraction**: Parsing with date and amount validation
5. **Error Reporting**: Detailed validation with sheet/row/column references

### State Management
- Centralized state with Zustand
- Upload progress tracking
- Error state management
- Data persistence utilities

### Accessibility Features
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Responsive design for mobile devices

## 🧩 API Reference

### Excel Parser
```typescript
import { parseExcelFile } from './utils/excelParser'

const result = await parseExcelFile(file)
// Returns: { workbook, errors, warnings }
```

### State Management
```typescript
import { useExcelStore } from './stores/excelStore'

const { setParsingResults, clearData } = useExcelStore()
```

## 🔄 Development Status

| Feature | Status | Tests | Notes |
|---------|--------|-------|-------|
| Excel File Upload | ✅ Complete | 16/16 | Drag-and-drop with progress |
| Multi-Sheet Parsing | ✅ Complete | 13/13 | SheetJS integration |
| Data Validation | ✅ Complete | 15/15 | Comprehensive error reporting |
| State Management | ✅ Complete | - | Zustand integration |
| AI Categorization | 🔄 Planned | - | OpenAI API integration |
| Budget Insights | 🔄 Planned | - | Analytics dashboard |
| Export Features | 🔄 Planned | - | PDF/CSV export |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📝 License

[License information]

---

**Built with ❤️ for personal finance management**
