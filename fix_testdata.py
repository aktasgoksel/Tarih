import codecs
import re

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

# Replace testData with window.testData, but avoid replacing window.window.testData
content = re.sub(r'(?<!window\.)\btestData\b', 'window.testData', content)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Replaced testData with window.testData.")
