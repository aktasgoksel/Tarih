import codecs

with codecs.open('index_dev.html', 'r', 'utf-8') as f:
    content = f.read()

loader_html = """
    <!-- GLOBAL LOADER -->
    <div id="global-loader" class="hidden fixed inset-0 bg-slate-900 z-[100] flex-col items-center justify-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mb-4"></div>
        <p class="text-white text-lg font-medium" id="loader-text">Veritabanına bağlanılıyor...</p>
    </div>
"""

idx = content.find('<div id="auth-screen"')
new_content = content[:idx] + loader_html + '\n' + content[idx:]

with codecs.open('index_dev.html', 'w', 'utf-8') as f:
    f.write(new_content)
