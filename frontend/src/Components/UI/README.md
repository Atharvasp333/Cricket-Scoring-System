# UI Components

A collection of reusable UI components built with React and Tailwind CSS.

## Installation

These components are already set up in the project. Import them as needed from `@/Components/UI`.

## Available Components

### 1. Button

A versatile button component with various styles and states.

```jsx
import { Button } from '@/Components/UI';

// Basic usage
<Button onClick={() => {}}>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons
import { Plus } from 'lucide-react';
<Button startIcon={<Plus />}>Add Item</Button>
```

### 2. Card

A flexible card component for content containers.

```jsx
import { Card } from '@/Components/UI';

<Card title="Card Title" subtitle="Card Subtitle">
  Card content goes here
</Card>
```

### 3. Modal

A customizable modal dialog.

```jsx
import { Modal } from '@/Components/UI';

const [isOpen, setIsOpen] = useState(false);

<Button onClick={() => setIsOpen(true)}>Open Modal</Button>
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  Modal content goes here
</Modal>
```

### 4. FormInput

A form input field with validation.

```jsx
import { FormInput } from '@/Components/UI';

const [value, setValue] = useState('');

<FormInput
  label="Email"
  name="email"
  type="email"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Enter your email"
  error={errors.email}
  required
/>
```

### 5. Select

A dropdown select component.

```jsx
import { Select } from '@/Components/UI';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

const [selected, setSelected] = useState('');

<Select
  label="Select an option"
  name="options"
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
  options={options}
  placeholder="Choose an option"
/>
```

### 6. Badge

A small status indicator.

```jsx
import { Badge } from '@/Components/UI';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>
<Badge variant="warning">Pending</Badge>
```

### 7. Table

A data table component.

```jsx
import { Table } from '@/Components/UI';

const columns = [
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
  { 
    key: 'status', 
    title: 'Status',
    render: (value) => <Badge variant={value === 'active' ? 'success' : 'danger'}>{value}</Badge>
  },
];

const data = [
  { id: 1, name: 'John Doe', age: 30, status: 'active' },
  { id: 2, name: 'Jane Smith', age: 25, status: 'inactive' },
];

<Table 
  columns={columns} 
  data={data} 
  keyField="id"
  onRowClick={(row) => console.log('Row clicked:', row)}
/>
```

## Styling

All components are styled using Tailwind CSS classes. You can override styles using the `className` prop.

## Accessibility

Components include proper ARIA attributes and keyboard navigation where applicable.

## TypeScript Support

All components include PropTypes for type checking. To enable TypeScript, rename files to `.tsx` and add type definitions.
