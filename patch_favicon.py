import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_favicon = '<link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/3253/3253112.png">'
new_favicon = '<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏛️</text></svg>">'

content = content.replace(old_favicon, new_favicon)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Favicon replaced with inline SVG!")
