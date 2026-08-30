import codecs

with codecs.open('src/style.css', 'r', 'utf-8') as f:
    content = f.read()

content = content.replace('@tailwind base;', '@import "tailwindcss";')
content = content.replace('@tailwind components;', '')
content = content.replace('@tailwind utilities;', '')

with codecs.open('src/style.css', 'w', 'utf-8') as f:
    f.write(content)

print("Updated style.css for Tailwind v4.")
