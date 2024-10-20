const express = require('express');
const Rule = require('../models/Rule');
const ruleEngine = require('../services/ruleEngine');

const router = express.Router();

router.post('/create-rule', async (req, res) => {
  const { name, ruleString } = req.body;
  try {
    const ast = ruleEngine.create_rule(ruleString);
    const ruleId = await Rule.create(name, ruleString);
    res.json({ success: true, ruleId, ast });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/combine-rules', async (req, res) => {
  const { rules } = req.body; // Expect an array of rule strings
  try {
    const combinedAst = ruleEngine.combine_rules(rules);
    res.json({ success: true, combinedAst });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/evaluate-rule', async (req, res) => {
  const { ast, data } = req.body; // Expect the AST and data directly
  try {
    const isEligible = ruleEngine.evaluate_rule(ast, data);
    res.json({ success: true, isEligible });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;