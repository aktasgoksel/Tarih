import codecs
import re

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

# Replace testsData with testData
content = content.replace("window.testsData", "window.testData")

# BUT wait, what if 'testData' is used as a local variable somewhere else?
# Let's just make sure testsData is completely replaced by testData
content = content.replace("testsData", "testData")

# Check if 'testData' is used without 'window.'
# It will work because 'window.testData' sets the global, so 'testData' will resolve to it.
# However, inside modules, it's safer to explicitly attach it to window.
# But the original code just used 'testData'.

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed variable name bug.")
