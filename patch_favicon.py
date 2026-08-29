import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_head = '''    <title>TarihApp - Akıllı KPSS Asistanı</title>
    <!-- SEO Meta Tags -->'''

new_head = '''    <title>TarihApp - Akıllı KPSS Asistanı</title>
    <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/3253/3253112.png">
    <!-- SEO Meta Tags -->'''

content = content.replace(old_head, new_head)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Favicon added successfully!")
