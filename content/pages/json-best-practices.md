---
title: JSON Best Practices - Conventions, Tips & Security
description: JSON best practices for developers. Learn naming conventions, structure design, performance tips, and security practices for production-ready JSON.
---

# JSON Best Practices

JSON best practices for developers. Learn naming conventions, structure design, performance tips, and security practices for production-ready JSON.

_Last updated: March 2026 • Audience: Backend & Frontend Developers_

---

## Naming Conventions

### Key Naming

**Use camelCase for keys:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2026-03-04T12:00:00Z"
}
```

**Avoid:**

- `snake_case`: `"first_name"` (use camelCase for JSON)
- `UPPER_CASE`: `"FIRST_NAME"` (reserved for constants)
- `kebab-case`: `"first-name"` (invalid in many languages)
- Single letter keys: `"n"` (not descriptive)

### Consistent Naming

Use consistent terminology across your API:

```json
{
  "userId": 123,
  "userName": "john_doe",
  "userEmail": "john@example.com",
  "userProfile": { ... }
}
```

**Consistent prefix:**

- User-related: `userId`, `userName`, `userEmail`
- Product-related: `productId`, `productName`, `productPrice`

### Boolean Naming

Start boolean keys with `is`, `has`, `can`, or `should`:

```json
{
  "isActive": true,
  "hasPermission": false,
  "canEdit": true,
  "shouldNotify": false
}
```

### Collection Naming

Use plural for array keys, singular for object keys:

```json
{
  "users": [
    // Plural (array)
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "metadata": {
    // Singular (object)
    "count": 2,
    "page": 1
  }
}
```

## Structure Design

### Consistent Object Structure

All objects of the same type should have identical fields:

**Good:**

```json
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" }
]
```

**Bad:**

```json
[
  { "id": 1, "name": "Alice" }, // Missing email
  { "id": 2, "email": "bob@example.com" } // Missing name
]
```

### Appropriate Data Types

Use correct types for values:

**Good:**

```json
{
  "age": 30, // Number, not "30"
  "price": 99.99, // Number, not "99.99"
  "isActive": true, // Boolean, not "true"
  "count": 0, // Number, not null
  "createdAt": "2026-03-04T12:00:00Z" // ISO 8601 date string
}
```

**Bad:**

```json
{
  "age": "30", // String, should be number
  "price": "99.99", // String, should be number
  "isActive": "true", // String, should be boolean
  "count": null // Null, should be 0
}
```

### Date Formatting

Use ISO 8601 format for all dates:

```json
{
  "createdAt": "2026-03-04T12:00:00Z",
  "updatedAt": "2026-03-04T14:30:00Z",
  "startDate": "2026-03-01",
  "time": "14:30:00"
}
```

**Components:**

- `YYYY-MM-DDTHH:mm:ss.sssZ`
- Always include timezone (`Z` for UTC)
- Use milliseconds only if needed
- For dates only: `YYYY-MM-DD`

### Null Handling

Use `null` intentionally, not empty strings or 0:

**Good:**

```json
{
  "middleName": null, // No middle name
  "spouse": null, // Unmarried
  "profilePicture": null // No picture uploaded
}
```

**Bad:**

```json
{
  "middleName": "", // Empty string (ambiguous)
  "spouse": "no spouse", // String, should be null
  "profilePicture": "none" // String, should be null
}
```

**When to use null:**

- Missing optional values
- Unavailable data
- Intentionally absent fields

**When NOT to use null:**

- Required fields (throw error instead)
- Empty strings (use `""`)
- Zero or false (use `0` or `false`)

## Performance Tips

### Minify for Network Transmission

Reduce payload size by minifying:

```json
{ "id": 123, "name": "John", "age": 30, "active": true }
```

**Size reduction:** 30-40% smaller than pretty-printed JSON.

### Limit Response Size

Return only necessary fields:

**Good - Specific fields:**

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Bad - All fields:**

```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "address": { ... },
  "preferences": { ... },
  "activityLog": [ ... ],
  "metadata": { ... }
}
```

Use pagination for large arrays:

```json
{
  "users": [
    { "id": 1, "name": "Alice" },
    { "id": 2, "name": "Bob" }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 100
  }
}
```

### Avoid Deep Nesting

Deep nesting slows parsing and makes data hard to navigate:

**Good - Flat structure:**

```json
{
  "userId": 123,
  "userName": "John",
  "orderId": 456,
  "orderDate": "2026-03-04"
}
```

**Bad - Deep nesting:**

```json
{
  "data": {
    "user": {
      "profile": {
        "details": {
          "id": 123,
          "name": "John"
        }
      }
    },
    "orders": {
      "history": {
        "recent": [
          {
            "id": 456,
            "date": "2026-03-04"
          }
        ]
      }
    }
  }
}
```

### Use Compression

Enable gzip or brotli compression for JSON responses:

- Gzip: 60-80% reduction
- Brotli: 70-90% reduction
- Almost zero CPU overhead

## API Design Best Practices

### HTTP Methods

Use appropriate HTTP methods:

| Method | Use Case         | Example                 |
| ------ | ---------------- | ----------------------- |
| GET    | Retrieve data    | `GET /api/users`        |
| POST   | Create resource  | `POST /api/users`       |
| PUT    | Replace resource | `PUT /api/users/123`    |
| PATCH  | Partial update   | `PATCH /api/users/123`  |
| DELETE | Delete resource  | `DELETE /api/users/123` |

### Response Structure

Use consistent response format:

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation completed",
  "timestamp": "2026-03-04T12:00:00Z"
}
```

**Error response:**

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": { "field": "email" }
  },
  "timestamp": "2026-03-04T12:00:00Z"
}
```

### Version Your API

Include version in URL or headers:

```
URL versioning: /api/v1/users
Header versioning: Accept: application/vnd.myapi.v1+json
```

## Security Best Practices

### Validate Input

Never trust client JSON:

```javascript
// Validate before parsing
if (!isValidJson(request.body)) {
  return res.status(400).json({ error: "Invalid JSON" });
}

// Validate schema
const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    age: { type: "number", minimum: 0 },
  },
  required: ["name"],
};
```

### Sanitize Output

Remove sensitive data from JSON responses:

```json
{
  "id": 123,
  "name": "John",
  "email": "john@example.com",
  "password": "****", // Never return passwords
  "creditCard": "****-****-****-1234"
}
```

### Prevent JSON Injection

Escape user input:

```javascript
// Escape HTML entities to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

### Use HTTPS

Always encrypt JSON in transit:

- JSON is plain text
- HTTPS encrypts entire payload
- Prevents man-in-the-middle attacks

### Implement Rate Limiting

Prevent abuse of JSON APIs:

- Limit requests per IP
- Limit payload size
- Timeout slow requests

## JSON Schema Validation

Use JSON Schema to validate structure:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "age": {
      "type": "number",
      "minimum": 0,
      "maximum": 150
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "email"]
}
```

**Benefits:**

- Automatic validation
- Clear documentation
- Type safety
- Error messages

## Testing JSON

### Validate with Linters

Use JSON linters in your CI/CD:

- `jsonlint` - Validate syntax
- `ajv` - Validate against schema
- Custom rules for your conventions

### Unit Test JSON Generation

```javascript
// Test that your API returns correct JSON structure
test("GET /api/users returns valid JSON", async () => {
  const response = await fetch("/api/users");
  const json = await response.json();

  expect(json).toHaveProperty("status", "success");
  expect(json.data).toBeInstanceOf(Array);
  expect(json.data[0]).toHaveProperty("id");
  expect(json.data[0]).toHaveProperty("name");
});
```

## Common Mistakes to Avoid

### 1. Using Numbers as Keys

**Bad:**

```json
{
  "1": "Alice",
  "2": "Bob"
}
```

**Good:**

```json
{
  "users": {
    "1": "Alice",
    "2": "Bob"
  }
}
```

### 2. Trailing Commas

**Bad:**

```json
{
  "name": "John",
  "age": 30
}
```

**Good:**

```json
{
  "name": "John",
  "age": 30
}
```

### 3. Using Single Quotes

**Bad:**

```json
{
  "name": "John"
}
```

**Good:**

```json
{
  "name": "John"
}
```

### 4. Comments in JSON

**Bad:**

```json
{
  "name": "John",
  // This is a comment
  "age": 30
}
```

**Good:**

```json
{
  "name": "John",
  "age": 30
}
```

### 5. Mixing Data Types

**Bad:**

```json
{
  "items": ["text", 123, true, null]
}
```

**Good:**

```json
{
  "items": [
    { "type": "text", "value": "example" },
    { "type": "number", "value": 123 },
    { "type": "boolean", "value": true }
  ]
}
```

Validate, format, and explore your JSON with our free online editor. Features include real-time validation, tree view, graph visualization, and best practices checker—all without registration.

**References:** RFC 8259, JSON Schema specification, OWASP API Security Guidelines.
