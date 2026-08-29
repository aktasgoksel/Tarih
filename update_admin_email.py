import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

# Replace the guessed emails with the actual email provided by the user
old_emails = "const ADMIN_EMAILS = ['aktasgoksel@gmail.com', 'gokselaktas@gmail.com'];"
new_emails = "const ADMIN_EMAILS = ['gokselaktas84@gmail.com'];"

content = content.replace(old_emails, new_emails)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Admin email updated successfully!")
