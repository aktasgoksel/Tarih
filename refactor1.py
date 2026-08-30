import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

idx1 = content.find('import { initializeApp }')
idx2 = content.find('window.testData = [];')

new_content = content[:idx1] + 'import { auth, db } from "./firebase.js";\n\n' + content[idx2:]

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(new_content)
