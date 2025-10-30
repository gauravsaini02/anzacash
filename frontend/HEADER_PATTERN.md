# Header Pattern Documentation

## Overview
This document establishes the consistent header pattern to be used across all pages in the ANZACASH application.

## Header Components
- **SharedHeader**: Reusable component that handles all header logic
- **Custom Headers**: For special cases (like CustomerHomePage with additional features)

## Header Structure

### Left Side
- **Logo**: "ANZACASH" text (clickable - navigates to home)
- **Navigation Menu**: Context-aware navigation items

### Right Side
- **Heart Icon**: Wishlist with notification badge
- **Shopping Cart Icon**: Cart with notification badge
- **Divider Line**: Gray vertical separator
- **Authentication Options**:
  - **Logged In**: Profile icon with dropdown menu
  - **Logged Out**: "Sign In" button

## Navigation Items by Page

### Home Page
- Home (active)
- Categories
- Vendors
- Deals
- Support

### Categories Page
- Home
- Categories (active)
- Vendors
- Deals
- Support

### Dashboard Page
- Dashboard (active)
- Shop
- Orders
- Rewards

### Product Detail Page
- Home
- Categories (active)
- Vendors
- MLM Program
- Support

## Usage Pattern

```tsx
import SharedHeader from './components/SharedHeader';

<SharedHeader currentPage="categories" />
```

### Available Page Types
- `home` - Home page navigation
- `categories` - Categories page navigation
- `dashboard` - Dashboard navigation
- `product` - Product detail page navigation

## Authentication State Management
The SharedHeader automatically:
- Checks localStorage for authentication tokens
- Displays appropriate UI based on login state
- Handles profile dropdown interactions
- Manages logout functionality

## Styling Guidelines
- Uses consistent spacing: `space-x-6 sm:space-x-8`
- Responsive design with mobile considerations
- Primary color for active states
- Hover effects on all interactive elements
- Proper z-index for dropdown menus

## Future Pages
When creating new pages:
1. Import and use SharedHeader component
2. Pass appropriate `currentPage` prop
3. Add new navigation patterns to SharedHeader if needed
4. Maintain consistent authentication flow

## Custom Headers
Only create custom headers when:
- Page requires significantly different navigation
- Additional header features are needed
- Page has special layout requirements

Example: CustomerHomePage has custom header with welcome banner and search integration.