import codecs
import re

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# 1. Modify the HTML around test-dropdown to add a refresh button
old_dropdown_html = '''                        <select id="test-dropdown" class="w-full border border-blue-400 dark:border-slate-600 rounded-lg shadow-sm p-3 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors cursor-pointer" onchange="window.showTest(this.value)">
                            <!-- Options will be generated -->
                        </select>'''

new_dropdown_html = '''                        <div class="flex gap-2">
                            <select id="test-dropdown" class="w-full border border-blue-400 dark:border-slate-600 rounded-lg shadow-sm p-3 bg-white dark:bg-slate-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors cursor-pointer" onchange="window.showTest(this.value)">
                                <!-- Options will be generated -->
                            </select>
                            <button id="reshuffle-random-btn" onclick="window.generateRandomTest()" class="hidden shrink-0 px-4 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded-lg border border-purple-300 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors shadow-sm" title="Yeni Sorular Üret">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                            </button>
                        </div>'''

content = content.replace(old_dropdown_html, new_dropdown_html)

# 2. Expose generateRandomTest to window so it can be called from onclick
# Find the function generateRandomTest() { and replace with window.generateRandomTest = function() {
content = content.replace('function generateRandomTest() {', 'window.generateRandomTest = function() {')
content = content.replace('generateRandomTest();', 'window.generateRandomTest();')

# 3. Toggle the button visibility in showTest() and renderDropdown()
# Let's find showTest logic and add a line to toggle the reshuffle-random-btn
# Specifically, we know `showTest` handles the mode changes. We can just add a UI update step inside `updateUI()` or at the end of `showTest()`.
# Wait, actually `renderDropdown` sets the value. Let's just update visibility in `showTest()` right at the top.
# And inside `updateUI()` we can make sure it stays in sync.
# Let's just add it to `renderDropdown` where we check the currentMode.

old_render_dropdown = '''            document.getElementById('test-dropdown').innerHTML = html;
            
            if(currentMode === 'NORMAL') document.getElementById('test-dropdown').value = currentTestIndex;
            else document.getElementById('test-dropdown').value = currentMode;
        }'''

new_render_dropdown = '''            document.getElementById('test-dropdown').innerHTML = html;
            
            if(currentMode === 'NORMAL') document.getElementById('test-dropdown').value = currentTestIndex;
            else document.getElementById('test-dropdown').value = currentMode;
            
            // Toggle Reshuffle Button
            if(currentMode === 'RANDOM_27') {
                document.getElementById('reshuffle-random-btn').classList.remove('hidden');
                document.getElementById('reshuffle-random-btn').classList.add('flex', 'items-center', 'justify-center');
            } else {
                document.getElementById('reshuffle-random-btn').classList.add('hidden');
                document.getElementById('reshuffle-random-btn').classList.remove('flex', 'items-center', 'justify-center');
            }
        }'''
content = content.replace(old_render_dropdown, new_render_dropdown)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Reshuffle button added to UI successfully!")
