import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

# Add loader functions at the very top
loader_js = """
window.showLoader = function(msg = "Yükleniyor...") {
    const loader = document.getElementById('global-loader');
    if(loader) {
        document.getElementById('loader-text').textContent = msg;
        loader.classList.remove('hidden');
        loader.classList.add('flex');
    }
};
window.hideLoader = function() {
    const loader = document.getElementById('global-loader');
    if(loader) {
        loader.classList.add('hidden');
        loader.classList.remove('flex');
    }
};
"""
content = loader_js + '\n' + content

# Fix auth screen hiding
idx_auth = content.find("document.getElementById('app-screen').classList.remove('hidden');")
idx_auth_end = content.find("document.getElementById('app-screen').classList.add('flex');", idx_auth) + len("document.getElementById('app-screen').classList.add('flex');")

content = content[:idx_auth] + "window.showLoader('Verileriniz Firebase\\'den indiriliyor, lütfen bekleyin...');\n" + content[idx_auth_end:]

# Show app screen after loadTestsFromFirestore
idx_tests = content.find("updateFavoritesBadge();")
idx_tests_end = idx_tests + len("updateFavoritesBadge();")

reveal_js = """
                window.hideLoader();
                document.getElementById('app-screen').classList.remove('hidden');
                document.getElementById('app-screen').classList.add('flex');
"""
content = content[:idx_tests_end] + reveal_js + content[idx_tests_end:]

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)
