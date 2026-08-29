import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Remove HTML
old_html = '<span id="user-level" class="hidden shrink-0 ml-2 px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-yellow-500/30">Çömez</span>'
content = content.replace(old_html, '')

# 2. Remove JS Function Definition
old_js_def = '''        function updateUserLevel() {
            const levelEl = document.getElementById('user-level');
            if(!userData.testProgress) return;
            
            let finishedCount = Object.values(userData.testProgress).filter(p => p && p.finished).length;
            
            let levelName = "Çömez";
            if(finishedCount >= 1) levelName = "Tarih Meraklısı";
            if(finishedCount >= 2) levelName = "Tarih Kurdu";
            if(finishedCount >= 3) levelName = "Tarih Profesörü"; // since there are only 3 tests right now
            
            levelEl.textContent = levelName;
            levelEl.classList.remove('hidden');
        }'''
content = content.replace(old_js_def, '')

# 3. Remove JS Calls
content = content.replace('updateUserLevel();', '')

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("User level gamification removed successfully!")
