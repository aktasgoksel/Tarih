import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

# Fix the condition to correctly call showTest
bad_condition = """if (window.testData.length > 0 && typeof currentTestIndex === 'undefined') {
            window.showTest(0);
        }"""
        
good_condition = """if (window.testData.length > 0) {
            window.showTest(currentTestIndex || 0);
        }"""

content = content.replace(bad_condition, good_condition)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed condition for initial test load.")
