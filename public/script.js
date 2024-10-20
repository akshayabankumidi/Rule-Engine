const API_BASE_URL = 'http://localhost:3000/api/rules';
document.getElementById('createRuleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('ruleName').value;
    const ruleString = document.getElementById('ruleString').value;
    try {
        const response = await fetch(`${API_BASE_URL}/create-rule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, ruleString })
        });
        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
});

document.getElementById('combineRulesForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rules = document.getElementById('ruleStrings').value.split('\n').filter(rule => rule.trim() !== '');
    try {
        const response = await fetch(`${API_BASE_URL}/combine-rules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rules })
        });
        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
});

document.getElementById('evaluateRuleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const ast = JSON.parse(document.getElementById('ast').value);
        const data = JSON.parse(document.getElementById('jsonData').value);
        console.log(ast);
        console.log("data: ", data);
        const response = await fetch(`${API_BASE_URL}/evaluate-rule`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ast, data })
        });
        const result = await response.json();
        document.getElementById('result').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
});