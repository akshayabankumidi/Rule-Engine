# Rule Engine Project

This project implements a simple 3-tier rule engine application with a frontend interface, backend API, and database integration. It allows users to create, combine, and evaluate complex logical rules.


## Database Schema 
![image](https://github.com/user-attachments/assets/9646c5fe-2e76-465b-afc3-08fd051b47e2)


## Features

- Create rules using a simple string syntax
- Combine multiple rules into a single, more complex rule
- Evaluate rules against provided data
- Frontend interface for easy interaction with the rule engine
- RESTful API for rule management and evaluation
- Efficient rule combination using most frequent operator heuristic
- Robust error handling and input validation

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Additional: CORS for cross-origin requests

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- PostgreSQL (v12 or later)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/rule-engine.git
   cd rule-engine
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a PostgreSQL database named `rule_engine_db`
   - Update the `.env` file with your database credentials:
     ```
     DB_USER=your_username
     DB_HOST=localhost
     DB_NAME=rule_engine_db
     DB_PASSWORD=your_password
     DB_PORT=5432
     ```

## Running the Application

1. Start the backend server:
   - Navigate to the `src` directory:
     ```
     cd src
     ```
   - Start the server:
     ```
     node app.js
     ```
   The server will start on `http://localhost:3000`

2. Open the frontend:
   - Navigate to the `public` directory
   - Open `index.html` in a web browser or use a simple HTTP server

## API Endpoints

- POST `/api/rules/create-rule`: Create a new rule
- POST `/api/rules/combine-rules`: Combine multiple rules
- POST `/api/rules/evaluate-rule`: Evaluate a rule against provided data

## Usage Examples

### Creating a Rule

```javascript
fetch('/api/rules/create-rule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Adult Sales Rule",
    ruleString: "(age > 18 AND department = 'Sales')"
  })
})
```

### Combining Rules

```javascript
fetch('/api/rules/combine-rules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    rules: [
      "(age > 30 AND department = 'Sales')",
      "(experience > 5 OR salary > 50000)"
    ]
  })
})
```

### Evaluating a Rule

```javascript
fetch('/api/rules/evaluate-rule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ast: {/* AST structure */},
    data: {
      age: 35,
      department: 'Sales',
      experience: 7,
      salary: 60000
    }
  })
})
```

## Testing

As this project does not include automated unit tests, we encourage manual testing using the following sample inputs and expected outputs. These tests cover the main functionalities and some edge cases of the Rule Engine.

### How to Test

1. Ensure your backend server is running (`node src/app.js`)
2. Use a tool like Postman, curl, or the fetch API in your browser console to send requests to the appropriate endpoints
3. Compare the responses with the expected outputs provided below

### Test Cases

#### 1. Create Rule

**Endpoint:** POST `/api/rules/create-rule`

**Input:**
```json
{
  "name": "Adult in Sales",
  "ruleString": "(age >= 18 AND department = 'Sales')"
}
```

**Expected Output:**
```json
{
  "success": true,
  "ruleId": 1,
  "ast": {
    "type": "operator",
    "value": "AND",
    "left": {
      "type": "operand",
      "value": "age >= 18"
    },
    "right": {
      "type": "operand",
      "value": "department = 'Sales'"
    }
  }
}
```

#### 2. Combine Rules

**Endpoint:** POST `/api/rules/combine-rules`

**Input:**
```json
{
  "rules": [
    "(age >= 18 AND department = 'Sales')",
    "(experience > 5 OR salary > 50000)"
  ]
}
```

**Expected Output:**
```json
{
  "success": true,
  "combinedAst": {
    "type": "operator",
    "value": "AND",
    "left": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operand",
        "value": "age >= 18"
      },
      "right": {
        "type": "operand",
        "value": "department = 'Sales'"
      }
    },
    "right": {
      "type": "operator",
      "value": "OR",
      "left": {
        "type": "operand",
        "value": "experience > 5"
      },
      "right": {
        "type": "operand",
        "value": "salary > 50000"
      }
    }
  }
}
```

#### 3. Evaluate Rule

**Endpoint:** POST `/api/rules/evaluate-rule`

**Input:**
```json
{
  "ast": {
    "type": "operator",
    "value": "AND",
    "left": {
      "type": "operator",
      "value": "AND",
      "left": {
        "type": "operand",
        "value": "age >= 18"
      },
      "right": {
        "type": "operand",
        "value": "department = 'Sales'"
      }
    },
    "right": {
      "type": "operator",
      "value": "OR",
      "left": {
        "type": "operand",
        "value": "experience > 5"
      },
      "right": {
        "type": "operand",
        "value": "salary > 50000"
      }
    }
  },
  "data": {
    "age": 30,
    "department": "Sales",
    "experience": 7,
    "salary": 55000
  }
}
```

**Expected Output:**
```json
{
  "success": true,
  "isEligible": true
}
```

### Error Handling Tests

The Rule Engine also handles various error cases. Here are some examples:

#### 4. Create Rule with Invalid Syntax

**Input:**
```json
{
  "name": "Invalid Rule",
  "ruleString": "(age > AND department = 'Sales')"
}
```

**Expected Output:**
```json
{
  "success": false,
  "error": "Invalid rule string: Unexpected token 'AND'"
}
```

#### 5. Evaluate Rule with Missing Data

**Input:**
```json
{
  "ast": {
    "type": "operand",
    "value": "age >= 18"
  },
  "data": {
    "department": "Sales"
  }
}
```

**Expected Output:**
```json
{
  "success": false,
  "error": "Data missing required attribute: age"
}
```

#### 6. Combine Empty Rule Set

**Input:**
```json
{
  "rules": []
}
```

**Expected Output:**
```json
{
  "success": false,
  "error": "Invalid input: rules must be a non-empty array of strings"
}
```

### Additional Error Handling

The Rule Engine also handles other syntax errors in rule strings, such as:
- Missing parentheses: `age >= 18 AND department = 'Sales'`
- Extra parentheses: `((age >= 18) AND (department = 'Sales'))`
- Invalid operators: `age >= 18 XOR department = 'Sales'`

When testing, try various malformed inputs to ensure the system responds with appropriate error messages.

Note: The actual error messages may vary slightly based on the specific implementation.

## Additional Notes

- The rule engine uses an Abstract Syntax Tree (AST) for efficient rule representation and evaluation.
- CORS is enabled to allow frontend and backend to run on different ports during development.
- Input validation is implemented to prevent invalid rule strings or data formats.

