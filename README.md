# Rule Engine Project

This project implements a simple 3-tier rule engine application with a frontend interface, backend API, and database integration. It allows users to create, combine, and evaluate complex logical rules.

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

4. Run database migrations:
   ```
   npm run migrate
   ```

## Running the Application

1. Start the backend server:
   ```
   npm start
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

Run the test suite with:

```
npm test
```

## Additional Notes

- The rule engine uses an Abstract Syntax Tree (AST) for efficient rule representation and evaluation.
- CORS is enabled to allow frontend and backend to run on different ports during development.
- Input validation is implemented to prevent invalid rule strings or data formats.

## Future Improvements

- Implement user authentication for secure rule management
- Add support for more complex rule operations (e.g., NOT, XOR)
- Improve performance with caching mechanisms for frequently evaluated rules
- Develop a more sophisticated UI for visual rule creation and management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
