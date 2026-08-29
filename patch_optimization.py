import codecs

with codecs.open('build_html.py', 'r', 'utf-8') as f:
    content = f.read()

old_head = r'''<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TarihApp - Akıllı KPSS Asistanı</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏛️</text></svg>">
    <!-- SEO Meta Tags -->'''

new_head = r'''<head>
    <meta charset="UTF-8">
    <!-- Responsive & Mobile Optimization -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
    
    <!-- Security Headers (Anti-XSS, Anti-Clickjacking, Privacy) -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()">
    
    <title>TarihApp - Akıllı KPSS Asistanı</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏛️</text></svg>">
    
    <!-- Preconnect for Performance Optimization -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://www.gstatic.com">
    <link rel="preconnect" href="https://cdn.tailwindcss.com">
    
    <!-- SEO Meta Tags -->'''

content = content.replace(old_head, new_head)

with codecs.open('build_html.py', 'w', 'utf-8') as f:
    f.write(content)

print("Optimization and Security features added to head!")
