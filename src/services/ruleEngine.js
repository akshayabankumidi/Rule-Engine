class Node {
  constructor(type, value = null, left = null, right = null) {
    this.type = type;
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function tokenize(ruleString) {
  if (typeof ruleString !== 'string' || ruleString.trim().length === 0) {
    throw new Error("Invalid rule string: Must be a non-empty string");
  }
  const tokens = ruleString.match(/\(|\)|\w+|[<>=]+|'[^']*'|\d+/g);
  if (!tokens) {
    throw new Error("Invalid rule string: Unable to tokenize");
  }
  return tokens;
}

function parse(tokens) {
  let depth = 0;
  
  function parseExpression() {
    let left = parseComparison();
    while (tokens.length > 0 && ['AND', 'OR'].includes(tokens[0])) {
      const op = tokens.shift();
      const right = parseComparison();
      left = new Node('operator', op, left, right);
    }
    return left;
  }

  function parseComparison() {
    if (tokens[0] === '(') {
      depth++;
      tokens.shift();
      const node = parseExpression();
      if (tokens[0] !== ')') {
        throw new Error("Mismatched parentheses: Missing closing parenthesis");
      }
      depth--;
      tokens.shift();
      return node;
    }
    if (tokens.length < 3) {
      throw new Error("Invalid comparison: Not enough tokens");
    }
    const left = tokens.shift();
    const op = tokens.shift();
    const right = tokens.shift();
    if (!['>', '<', '='].includes(op)) {
      throw new Error(`Invalid comparison operator: ${op}`);
    }
    return new Node('operand', `${left} ${op} ${right}`);
  }

  const ast = parseExpression();
  
  if (tokens.length > 0) {
    throw new Error("Unexpected tokens after parsing");
  }
  
  if (depth !== 0) {
    throw new Error("Mismatched parentheses");
  }
  
  return ast;
}

function create_rule(rule_string) {
  try {
    const tokens = tokenize(rule_string);
    return parse(tokens);
  } catch (error) {
    console.error(`Error creating rule: ${error.message}`);
    throw new Error(`Invalid rule string: ${error.message}`);
  }
}

function combine_rules(rules) {
  if (!Array.isArray(rules) || rules.length === 0) {
    throw new Error("Invalid input: rules must be a non-empty array of strings");
  }

  if (rules.length === 1) {
    return create_rule(rules[0]);
  }

  // Count operator frequencies
  const operatorCounts = rules.reduce((counts, rule) => {
    const operators = rule.match(/\b(AND|OR)\b/g) || [];
    operators.forEach(op => counts[op] = (counts[op] || 0) + 1);
    return counts;
  }, {});

  // Determine the most frequent operator
  const mostFrequentOperator = Object.entries(operatorCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'AND';

  // Combine rules using the most frequent operator
  const combinedRuleString = `(${rules.join(`) ${mostFrequentOperator} (`)})`;

  try {
    return create_rule(combinedRuleString);
  } catch (error) {
    throw new Error(`Error combining rules: ${error.message}`);
  }
}

function isValidASTNode(node) {
  if (!node || typeof node !== 'object') return false;
  if (node.type === 'operator') {
    return ['AND', 'OR'].includes(node.value) && 
           isValidASTNode(node.left) && 
           isValidASTNode(node.right);
  } else if (node.type === 'operand') {
    const parts = node.value.split(' ');
    return parts.length === 3 && ['>', '<', '='].includes(parts[1]);
  }
  return false;
}

function evaluate_rule(ast, data) {
  if (!isValidASTNode(ast)) {
    throw new Error("Invalid AST structure");
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error("Invalid data: must be a non-null object");
  }

  if (ast.type === 'operand') {
    const [attribute, operator, value] = ast.value.split(' ');
    if (!(attribute in data)) {
      throw new Error(`Data missing required attribute: ${attribute}`);
    }
    const dataValue = data[attribute];
    const compareValue = value.replace(/'/g, '');
    
    switch (operator) {
      case '>': return dataValue > Number(compareValue);
      case '<': return dataValue < Number(compareValue);
      case '=': return dataValue.toString() === compareValue;
      default: throw new Error(`Invalid operator: ${operator}`);
    }
  } else if (ast.type === 'operator') {
    const leftResult = evaluate_rule(ast.left, data);
    const rightResult = evaluate_rule(ast.right, data);
    return ast.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  }
  throw new Error("Unexpected AST node type");
}

module.exports = { create_rule, combine_rules, evaluate_rule, Node };