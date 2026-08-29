import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_dashboard_container = '''            <!-- Dashboard Controls -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-6 transition-colors duration-200">
                <div class="flex flex-col md:flex-row gap-5 justify-between items-center">
                    <div class="w-full md:w-1/2">'''

new_dashboard_container = '''            <!-- Dashboard Controls -->
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-6 transition-colors duration-200">
                <div class="flex flex-col md:flex-row gap-5 justify-between items-start">
                    <div class="w-full md:w-1/2">'''

content = content.replace(old_dashboard_container, new_dashboard_container)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Dashboard items-center changed to items-start for top alignment.")
