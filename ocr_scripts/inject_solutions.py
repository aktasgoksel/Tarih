import json, re

with open('data.js', encoding='utf-8') as f:
    data_str = f.read()
    
match = re.search(r'const testData = (\[.*\]);', data_str, re.DOTALL)
tests = json.loads(match.group(1))

with open('solutions_cleaned.json', encoding='utf-8') as f:
    solutions = json.load(f)

for i, test in enumerate(tests):
    test_id = str(i + 1)
    if test_id in solutions:
        paras = solutions[test_id]
        
        while len(paras) > 24:
            min_idx = 1
            min_len = len(paras[1])
            for j in range(2, len(paras)):
                if len(paras[j]) < min_len:
                    min_len = len(paras[j])
                    min_idx = j
            paras[min_idx - 1] += '\n\n' + paras[min_idx]
            paras.pop(min_idx)
            
        for q_idx, q in enumerate(test['questions']):
            if q_idx < len(paras):
                q['solution'] = paras[q_idx]

new_data_str = data_str[:match.start(1)] + json.dumps(tests, ensure_ascii=False, indent=2) + data_str[match.end(1):]

with open('data.js', 'w', encoding='utf-8') as f:
    f.write(new_data_str)
print('Updated data.js with cleaned solutions')
