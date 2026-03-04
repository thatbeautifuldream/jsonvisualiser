---
title: JSON Guide - Learn JSON Syntax, Types & Examples
description: Complete JSON guide for beginners. Learn JSON syntax, data types, structure, and examples. Reference for developers, students, and anyone working with JSON.
---

# Complete JSON Guide

Complete JSON guide for beginners. Learn JSON syntax, data types, structure, and examples. Reference for developers, students, and anyone working with JSON.

_Last updated: March 2026 • JSON Version: RFC 8259_

---

## What is JSON?

JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format. Despite the name, JSON is language-independent and works with virtually every programming language.

JSON was created by Douglas Crockford in the early 2000s as a simpler alternative to XML. Today, JSON is the standard for APIs, configuration files, and data storage.

**Key Facts:**

- Human-readable and writable
- Machine-parsable and -generable
- Language-independent
- Based on JavaScript object literals
- Supports complex data structures

## JSON Syntax Basics

JSON is built on two structures:

1. **Collection of key/value pairs** (object)
2. **Ordered list of values** (array)

### Syntax Rules

- Data in key/value pairs
- Separated by commas
- Curly braces `{}` hold objects
- Square brackets `[]` hold arrays
- Keys must be strings (in double quotes)
- String values must be in double quotes
- No trailing commas allowed
- No comments allowed

### Example JSON Object

```json
{
  "name": "John Doe",
  "age": 30,
  "isStudent": false,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "coding", "hiking"]
}
```

## JSON Data Types

JSON supports six data types:

### 1. String

Text data, enclosed in double quotes:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, World!"
}
```

**Valid String Characters:**

- Letters: `a-z`, `A-Z`
- Digits: `0-9`
- Symbols: `!@#$%^&*()_+-=[]{}|;:',.<>?`
- Spaces and whitespace
- Unicode characters: `\uXXXX`

**Escape Sequences:**

- `\"` - Double quote
- `\\` - Backslash
- `\/` - Forward slash
- `\b` - Backspace
- `\f` - Form feed
- `\n` - New line
- `\r` - Carriage return
- `\t` - Tab
- `\uXXXX` - Unicode character

### 2. Number

Numeric values, can be integer or floating-point:

```json
{
  "age": 30,
  "price": 99.99,
  "negative": -10,
  "scientific": 1.23e4,
  "zero": 0
}
```

**Valid Number Formats:**

- Integers: `42`, `-7`, `0`
- Floats: `3.14`, `-0.001`, `1.0`
- Scientific notation: `1.23e4`, `1.23E-4`
- No leading zeros: `0.42` (not `.42`)

### 3. Boolean

Logical values, either `true` or `false`:

```json
{
  "isActive": true,
  "isDeleted": false,
  "hasPermission": true
}
```

### 4. Array

Ordered list of values, enclosed in square brackets:

```json
{
  "numbers": [1, 2, 3, 4, 5],
  "names": ["Alice", "Bob", "Charlie"],
  "mixed": [42, "hello", true, null, { "key": "value" }],
  "nested": [
    [1, 2],
    [3, 4],
    [5, 6]
  ]
}
```

### 5. Object

Unordered collection of key/value pairs, enclosed in curly braces:

```json
{
  "person": {
    "name": "John",
    "age": 30
  },
  "empty": {},
  "nested": {
    "level1": {
      "level2": {
        "value": "deep"
      }
    }
  }
}
```

### 6. Null

Represents empty or non-existent value:

```json
{
  "middleName": null,
  "spouse": null,
  "address": null
}
```

**Note:** `null` is different from `false`, `0`, or empty string `""`.

## JSON Structure Examples

### Simple Object

```json
{
  "name": "John",
  "age": 30
}
```

### Nested Objects

```json
{
  "user": {
    "name": "John",
    "contact": {
      "email": "john@example.com",
      "phone": "+1-555-0123"
    }
  }
}
```

### Array of Objects

```json
{
  "users": [
    {
      "id": 1,
      "name": "Alice"
    },
    {
      "id": 2,
      "name": "Bob"
    },
    {
      "id": 3,
      "name": "Charlie"
    }
  ]
}
```

### Complex Structure

```json
{
  "company": "Tech Corp",
  "founded": 2010,
  "employees": [
    {
      "id": 1,
      "name": "Alice",
      "role": "Developer",
      "skills": ["JavaScript", "Python", "Go"],
      "projects": [
        {
          "name": "Project A",
          "status": "completed"
        }
      ]
    }
  ],
  "departments": {
    "engineering": {
      "head": "Bob",
      "count": 15
    },
    "design": {
      "head": "Carol",
      "count": 5
    }
  }
}
```

## JSON vs. JavaScript Object

| Feature         | JSON                | JavaScript Object |
| --------------- | ------------------- | ----------------- |
| Key Quotes      | Required            | Optional          |
| Quote Type      | Double only         | Single or double  |
| Trailing Commas | Invalid             | Valid             |
| Comments        | Not allowed         | Allowed           |
| Undefined       | Not valid           | Valid             |
| Functions       | Not allowed         | Allowed           |
| Dates           | String (ISO format) | Date objects      |
| Methods         | Not allowed         | Allowed           |

**Example - Valid JSON:**

```json
{
  "name": "John",
  "age": 30,
  "active": true
}
```

**Example - Valid JavaScript Object (Not JSON):**

```javascript
{
  name: "John",        // Unquoted key
  age: 30,
  active: true,
  createdAt: new Date(), // Date object
  greet: function() {}    // Function
}
```

## JSON vs. XML vs. CSV

| Aspect      | JSON         | XML                    | CSV                |
| ----------- | ------------ | ---------------------- | ------------------ |
| Readability | High         | Medium                 | Low                |
| Verbosity   | Low          | High                   | Very Low           |
| Structure   | Nested       | Nested (elements)      | Flat only          |
| Data Types  | Native types | Text (schema required) | Text only          |
| Comments    | No           | Yes                    | No                 |
| Namespaces  | No           | Yes                    | No                 |
| Parsing     | Easy         | Complex                | Simple             |
| Use Case    | APIs, Config | Documents              | Spreadsheets, Data |

## Parsing JSON in Different Languages

### JavaScript

```javascript
// Parse JSON string to object
const jsonString = '{"name": "John", "age": 30}';
const obj = JSON.parse(jsonString);
console.log(obj.name); // John

// Convert object to JSON string
const data = { name: "John", age: 30 };
const jsonString = JSON.stringify(data, null, 2);
```

### Python

```python
import json

# Parse JSON string to dict
json_string = '{"name": "John", "age": 30}'
data = json.loads(json_string)
print(data['name'])  # John

# Convert dict to JSON string
data = {"name": "John", "age": 30}
json_string = json.dumps(data, indent=2)
```

### PHP

```php
<?php
// Parse JSON string to array
$json_string = '{"name": "John", "age": 30}';
$data = json_decode($json_string, true);
echo $data['name'];  // John

// Convert array to JSON string
$data = ["name" => "John", "age" => 30];
$json_string = json_encode($data, JSON_PRETTY_PRINT);
?>
```

### Java

```java
import org.json.JSONObject;

// Parse JSON string
String jsonString = "{\"name\": \"John\", \"age\": 30}";
JSONObject obj = new JSONObject(jsonString);
System.out.println(obj.getString("name"));  // John

// Create JSON string
JSONObject obj = new JSONObject();
obj.put("name", "John");
obj.put("age", 30);
String jsonString = obj.toString(2);  // pretty print
```

## Common JSON Use Cases

### API Responses

REST APIs return JSON as the standard response format:

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "timestamp": "2026-03-04T12:00:00Z"
}
```

### Configuration Files

Application settings in JSON format:

```json
{
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
    "port": 3000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  }
}
```

### Data Storage

NoSQL databases like MongoDB store data as JSON-like documents:

```json
{
  "_id": "64f8c9e01234567890abcdef",
  "title": "Blog Post",
  "content": "This is the content...",
  "author": {
    "id": 123,
    "name": "John"
  },
  "tags": ["tech", "programming", "json"],
  "createdAt": "2026-03-04T12:00:00Z"
}
```

## JSON Best Practices

1. **Use camelCase for keys:** `"firstName"`, not `"first_name"`
2. **Use meaningful key names:** `"createdAt"`, not `"date1"`
3. **Keep structure consistent:** All user objects should have same fields
4. **Use appropriate data types:** Numbers for numeric values, not strings
5. **Format for readability:** Pretty-print for human readers
6. **Validate JSON:** Use validators before using in production
7. **Handle nulls gracefully:** Don't send empty strings when null is appropriate
8. **Use ISO 8601 for dates:** `"2026-03-04T12:00:00Z"`
9. **Limit nesting depth:** Very deep structures are hard to parse
10. **Document your JSON:** Provide schema or examples

## JSON Tools & Resources

- **JSON Validator:** [jsonvisualiser.com](https://jsonvisualiser.com)
- **Official Spec:** [RFC 8259](https://tools.ietf.org/html/rfc8259)
- **JSON Schema:** [json-schema.org](https://json-schema.org/)
- **Online Testers:** JSONLint, JSON Editor Online

Practice your JSON skills with our free online editor. Features include real-time validation, tree view, graph visualization, and formatting tools—all without registration.

**References:** RFC 8259 (JSON specification), ECMA-404, MDN JSON documentation.
