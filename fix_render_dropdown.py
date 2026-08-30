import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

content = content.replace('window.renderDropdown();', 'renderDropdown();')

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed window.renderDropdown bug.")
