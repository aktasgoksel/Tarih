import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

old_catch = """    } catch (error) {
        console.error("Failed to fetch tests:", error);
    }"""

new_catch = """    } catch (error) {
        console.error("Failed to fetch tests:", error);
        document.getElementById('current-test-title').textContent = "Hata: " + error.message;
        document.getElementById('current-test-title').classList.add('text-red-500');
    }"""

content = content.replace(old_catch, new_catch)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Injected visual error reporting.")
