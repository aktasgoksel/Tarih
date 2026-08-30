import codecs

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

old_block = """                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();
                
                await loadTestsFromFirestore();"""

new_block = """                await loadTestsFromFirestore();
                
                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();"""

content = content.replace(old_block, new_block)

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed load order!")
