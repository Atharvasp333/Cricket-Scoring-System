# Utility Functions

This directory contains reusable utility functions for the application.

## Available Functions

### `cn(...classes)`
Combines multiple class names into a single string, filtering out falsy values.

```javascript
import { cn } from '@/utils/helpers';

const className = cn('base-class', isActive && 'active', 'other-class');
// Result: 'base-class active other-class' (if isActive is true)
```

### `formatDate(date, locale = 'en-US')`
Formats a date string into a readable format.

```javascript
import { formatDate } from '@/utils/helpers';

const formatted = formatDate('2023-01-01T12:00:00Z');
// Result: 'Jan 1, 2023, 12:00 PM'
```

### `truncate(text, maxLength = 100)`
Truncates text to a specified length and adds an ellipsis if needed.

```javascript
import { truncate } from '@/utils/helpers';

const short = truncate('This is a long text that will be truncated', 20);
// Result: 'This is a long text...'
```

### `toTitleCase(str)`
Converts a string to title case.

```javascript
import { toTitleCase } from '@/utils/helpers';

const title = toTitleCase('hello world');
// Result: 'Hello World'
```

### `debounce(func, wait = 300)`
Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.

```javascript
import { debounce } from '@/utils/helpers';

const handleSearch = debounce((query) => {
  // API call or other expensive operation
  console.log('Searching for:', query);
}, 500);

// In your component:
// <input onChange={(e) => handleSearch(e.target.value)} />
```

### `formatNumber(number)`
Formats a number with commas as thousand separators.

```javascript
import { formatNumber } from '@/utils/helpers';

const formatted = formatNumber(1000000);
// Result: '1,000,000'
```

### `isValidEmail(email)`
Validates an email address.

```javascript
import { isValidEmail } from '@/utils/helpers';

const valid = isValidEmail('test@example.com');
// Result: true
```

### `createId(length = 8)`
Generates a unique ID string.

```javascript
import { createId } from '@/utils/helpers';

const id = createId();
// Result: 'a1b2c3d4' (random string)
```

## Usage

Import the functions you need in your components:

```javascript
import { formatDate, truncate } from '@/utils/helpers';
```

## Adding New Utilities

1. Add your new utility function to `helpers.js`
2. Document the function with JSDoc comments
3. Add an example to this README
4. Export the function in `index.js`

## Testing

All utility functions should be pure and easily testable. Consider adding tests in the `__tests__` directory.
