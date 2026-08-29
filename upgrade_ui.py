import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add Google Fonts
font_tag = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">\n    <script src="https://cdn.tailwindcss.com"></script>'
html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', font_tag)

# Update body style to use Inter
html = html.replace('<body class="bg-gray-100 text-gray-800 font-sans min-h-screen flex flex-col">', '<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col" style="font-family: \'Inter\', sans-serif;">')

# Enhance Header
old_header = '<header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">'
new_header = '<header class="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-md sticky top-0 z-10 text-white">'
html = html.replace(old_header, new_header)

# Fix text colors in header
html = html.replace('<h1 class="text-xl font-bold text-gray-900 truncate" id="current-test-title">Yükleniyor...</h1>', '<h1 class="text-xl font-bold text-white truncate" id="current-test-title">Yükleniyor...</h1>')
html = html.replace('class="text-sm font-medium text-gray-500 mb-1 block"', 'class="text-sm font-medium text-blue-100 mb-1 block"')
html = html.replace('class="w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50"', 'class="w-full border border-blue-400 rounded-md shadow-sm p-2 bg-white text-gray-800"')

# Enhance question cards
html = html.replace('class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"', 'class="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6 transition-all hover:shadow-lg"')

# Enhance buttons
html = html.replace('class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"', 'class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-all flex items-center gap-2 hover:shadow-md"')
html = html.replace('class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium transition-colors flex items-center gap-2"', 'class="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-sm transition-all flex items-center gap-2 hover:shadow-md"')
html = html.replace('class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors border border-gray-300"', 'class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors border border-slate-300 shadow-sm"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html UI!")
