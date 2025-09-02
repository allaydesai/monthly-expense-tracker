# Technical Stack

## Application Framework
**React 18.2+** - Modern React with hooks, functional components, and TypeScript 5.0+ for building the interactive dashboard

## Database System
**Local Storage** - Browser-based storage for user preferences and API keys (no server-side database required)

## TypeScript Framework
**TypeScript 5.0+** - Type-safe development with React for robust expense tracking interface

## Import Strategy
**Node** - Standard Node.js module resolution for dependency management

## CSS Framework
**Tailwind CSS 3.4** - Utility-first CSS framework for rapid UI development and consistent styling

## UI Component Library
**shadcn/ui** - High-quality, accessible React components built on Radix UI primitives with Tailwind CSS

## Fonts Provider
**@fontsource** - Self-hosted Google Fonts (Roboto and Inter) for optimal performance and privacy

## Icon Library
**Lucide React** - Modern, customizable icon library with consistent design

## Application Hosting
**Vercel** - Optimal for React applications with automatic deployments and CDN

## Database Hosting
**n/a** - No server-side database required (local processing only)

## Asset Hosting
**Vercel** - Static assets served through Vercel's CDN for optimal performance

## Deployment Solution
**Vercel** - Seamless integration with Git for continuous deployment

## Code Repository URL
**https://github.com/allay/monthly-expense-tracker** - Git repository for version control

## Additional Technologies

### File Processing
**SheetJS (xlsx)** - Excel file parsing and processing library
- Multi-sheet Excel file support (.xlsx format)
- Date parsing for various formats (datetime objects, text dates like '\xa021 Aug 25')
- Formula evaluation for Summary sheet totals (=SUM(SheetName!C2:CX))
- Handles positive/negative amounts and empty cells
- Support for 13+ column sheets with flexible data structure

### Data Visualization
**Chart.js with react-chartjs-2** - Interactive charts for spending analytics
- Alternative consideration: **Recharts** for React-native chart components

### AI Integration
**OpenAI API** - Transaction categorization using GPT models

### State Management
**Zustand 4.4+** - Lightweight state management for application state
- Fallback: React useState/useContext for simpler state needs

### Build Tool
**Vite 5.0+** - Fast build tool optimized for React and TypeScript development
- Hot module replacement for Excel file processing testing
- Built-in TypeScript support for type-safe Excel data handling
- Optimized bundling for SheetJS and Chart.js libraries

### Package Manager
**npm 10+** - Standard Node.js package manager
- Consistent with user's usual preferences
- Reliable dependency management and lock files