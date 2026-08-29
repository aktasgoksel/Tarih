import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

content = content.replace('"name": "KPSS Tarih Soru Bankası",', '"name": "TarihApp",')
content = content.replace('"short_name": "Tarih",', '"short_name": "TarihApp",')
content = content.replace('<title>KPSS Tarih Soru Bankası</title>', '<title>TarihApp - Akıllı KPSS Asistanı</title>')

# Update the H1 Title with a modern gradient text and an icon
old_h1 = '<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">KPSS Tarih</h1>'
new_h1 = '''<h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2 tracking-tight flex items-center justify-center gap-2">
    <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
    TarihApp
</h1>'''
content = content.replace(old_h1, new_h1)

# Update subtitle
old_sub = '<p class="text-gray-500 dark:text-gray-400">Çözümler, İstatistikler ve Hata Takibi</p>'
new_sub = '<p class="text-gray-500 dark:text-gray-400 font-medium tracking-wide mt-1">Akıllı KPSS Tarih Asistanı</p>'
content = content.replace(old_sub, new_sub)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Renamed to TarihApp successfully!")
