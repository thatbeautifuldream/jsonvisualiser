---
title: JSON Formatter - Pretty Print & Minify JSON
description: Format JSON with pretty print, minify, and custom indentation. Transform JSON between readable and compact formats. Free, no registration required.
---

# JSON Formatter: Pretty Print & Minify JSON

Format JSON with pretty print, minify, and custom indentation. Transform JSON between readable and compact formats. Free, no registration required.

_Last updated: March 2026 • Formats: Pretty-print, Minify, Sort Keys_

---

## What is JSON Formatting?

JSON formatting transforms JSON between two main states:

**Pretty-Printed JSON:** Readable, indented, with line breaks. Easy for humans to read and edit.

**Minified JSON:** Compact, no whitespace, single line. Ideal for APIs, file storage, and transmission.

JSON Visualiser lets you switch between formats instantly, with options for indentation size, key sorting, and more.

## Formatting Options

### Pretty Print (Beautify)

Transform compact JSON into readable, indented format:

```json
// Minified
{"name":"John","age":30,"active":true}

// Pretty-Printed (2 spaces)
{
  "name": "John",
  "age": 30,
  "active": true
}
```

**Options:**

- Indentation: 2, 4, or custom number of spaces
- Sort keys: Alphabetical or preserve order
- Add trailing newlines: Yes or no
- Space after colons: Yes or no

### Minify (Compress)

Transform readable JSON into compact format:

```json
// Pretty-Printed
{
  "name": "John",
  "age": 30,
  "active": true
}

// Minified
{"name":"John","age":30,"active":true}
```

**Benefits:**

- Smaller file size (up to 40% reduction)
- Faster transmission over network
- Ideal for API responses
- Reduces storage requirements

### Sort Keys Alphabetically

Reorder object keys alphabetically for consistency:

```json
// Original order
{
  "name": "John",
  "age": 30,
  "city": "NYC"
}

// Sorted keys
{
  "age": 30,
  "city": "NYC",
  "name": "John"
}

```

**Benefits:**

- Easier to find keys visually
- Consistent order across files
- Better for diff comparisons
- Git-friendly

## How to Format JSON

### Step 1: Open JSON Visualiser

Navigate to the JSON Visualiser homepage. No sign-up required.

### Step 2: Paste or Type JSON

Paste your JSON into the editor, or type directly. Monaco editor provides syntax highlighting.

### Step 3: Choose Format Option

Use the formatting toolbar:

- **Pretty Print:** Add indentation and line breaks
- **Minify:** Remove all whitespace
- **Sort Keys:** Alphabetically reorder object keys
- **Custom Indent:** Choose 2, 4, or custom spaces

### Step 4: Copy or Export

Copy the formatted JSON to your clipboard, or use the tree/graph views to explore the structure.

## Format Examples

### Configuration Files

Pretty-print configuration files for readability:

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp",
    "credentials": {
      "username": "admin",
      "password": "secret"
    }
  },
  "api": {
    "timeout": 30000,
    "retries": 3
  }
}
```

### API Responses

Minify API responses for faster transmission:

```json
{
  "status": "success",
  "data": { "id": 123, "name": "Product", "price": 99.99 },
  "timestamp": 1640995200
}
```

### Data Export

Sort keys for consistent data exports:

```json
{
  "email": "user@example.com",
  "id": "abc-123",
  "name": "John Doe",
  "role": "admin"
}
```

## Indentation Options

### 2 Spaces (Default)

Compact but readable:

```json
{
  "key": "value",
  "nested": {
    "item": "data"
  }
}
```

**Best for:** Most use cases, modern coding standards

### 4 Spaces

More indentation, clearer nesting:

```json
{
  "key": "value",
  "nested": {
    "item": "data"
  }
}
```

**Best for:** Very nested JSON, learning purposes

### Tabs (Tab Character)

Uses actual tab characters:

```json
{
  "key": "value",
  "nested": {
    "item": "data"
  }
}
```

**Best for:** Editor-specific preferences, legacy systems

## Pretty Print vs. Minify

| Aspect          | Pretty Print  | Minify          |
| --------------- | ------------- | --------------- |
| Readability     | Excellent     | Poor            |
| File Size       | Larger        | Smaller         |
| Transmission    | Slower        | Faster          |
| Editing         | Easy          | Difficult       |
| Debugging       | Easy          | Difficult       |
| Version Control | Diff-friendly | Hard to compare |
| Best For        | Humans        | Machines/Apis   |

## Formatting Best Practices

### For Human Readers

Use pretty-print formatting:

- Indentation: 2 or 4 spaces
- Sort keys alphabetically
- Add trailing newlines
- Space after colons for readability

### For APIs & Storage

Use minified formatting:

- Remove all whitespace
- Skip key sorting (preserve order)
- No trailing newlines
- Minify before network transmission

### For Version Control

Use consistent formatting:

- Same indentation across files
- Sort keys alphabetically
- Use pretty-print for diffs
- Run linters to enforce format

### For JSON Patches & Diffs

Use pretty-print with consistent order:

- Easier to see what changed
- Smaller diffs when consistent
- Better for code reviews

## Bulk Formatting

Format multiple JSON files:

```bash
# Format all .json files with jq
find . -name "*.json" -exec jq '.' {} > {}.formatted && mv {}.formatted {} \;

# Minify all .json files
find . -name "*.json" -exec jq -c '.' {} > {}.minified && mv {}.minified {} \;
```

Or paste multiple JSON objects into JSON Visualiser and format them one by one.

## Advanced Formatting

### Preserve Order

JavaScript objects maintain key insertion order (ES2015+). By default, JSON Visualiser preserves this order unless you choose to sort keys.

### Unicode Characters

JSON supports Unicode characters in strings. Pretty-printing doesn't escape Unicode by default, but you can choose to escape for specific use cases.

### Special Characters

Pretty-printing handles special characters correctly:

- Newlines in strings: `\n`
- Tabs in strings: `\t`
- Quotes: `\"` or `\'`
- Backslashes: `\\`

### Date Formatting

JSON has no native date type. Dates are typically strings in ISO 8601 format:

```json
{
  "createdAt": "2026-03-04T12:00:00Z",
  "updatedAt": "2026-03-04T14:30:00Z"
}
```

## Formatting in Different Languages

### JavaScript

```javascript
const data = { name: "John", age: 30 };
const pretty = JSON.stringify(data, null, 2); // 2-space indent
const minified = JSON.stringify(data);
```

### Python

```python
import json

data = {"name": "John", "age": 30}
pretty = json.dumps(data, indent=2)
minified = json.dumps(data, separators=(',', ':'))
```

### PHP

```php
$data = ["name" => "John", "age" => 30];
$pretty = json_encode($data, JSON_PRETTY_PRINT);
$minified = json_encode($data);
```

Format, pretty-print, and minify JSON instantly. No registration, instant load, and multiple formatting options for every use case.

**References:** JSON.stringify() documentation, Python json module, PHP json_encode().
