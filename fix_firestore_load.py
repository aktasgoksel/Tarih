import codecs
import re

with codecs.open('src/main.js', 'r', 'utf-8') as f:
    content = f.read()

# 1. Remove the standalone call to loadTestsFromFirestore()
content = content.replace("}\nloadTestsFromFirestore();\n", "}\n")

# 2. Inside onAuthStateChanged, replace the old renderDropdown/showTest with loadTestsFromFirestore
old_auth_block = """                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();
                
                renderDropdown();
                window.showTest(0); // Start at test 0
                
            } else {"""

new_auth_block = """                cleanStaleMistakes();
                updateMistakeBadge();
                updateFavoritesBadge();
                
                await loadTestsFromFirestore();
                
            } else {"""

content = content.replace(old_auth_block, new_auth_block)

# Just in case the exact spacing is different, let's use a regex fallback for the auth block
if new_auth_block not in content:
    content = re.sub(
        r'renderDropdown\(\);\s*window\.showTest\(0\);\s*// Start at test 0',
        r'await loadTestsFromFirestore();',
        content,
        flags=re.DOTALL
    )

with codecs.open('src/main.js', 'w', 'utf-8') as f:
    f.write(content)

print("Fixed loadTestsFromFirestore timing.")
