/**
 * Copyright (c) 2026 Göksel Aktaş. All Rights Reserved.
 * Bu dosyanın izinsiz kopyalanması veya kullanılması yasaktır.
 */

// --- THEME LOGIC ---
        function applyTheme(isDark) {
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                setThemeIcons('moon');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                setThemeIcons('sun');
            }
        }
        
        window.toggleDarkMode = function() {
            const isDark = document.documentElement.classList.contains('dark');
            applyTheme(!isDark);
        }

        function setThemeIcons(mode) {
            const sunIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
            const moonIcon = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
            
            const appIcon = document.getElementById('theme-icon-app');
            const authIcon = document.getElementById('theme-icon-auth');
            if(appIcon) appIcon.innerHTML = mode === 'dark' ? sunIcon : moonIcon;
            if(authIcon) authIcon.innerHTML = mode === 'dark' ? sunIcon : moonIcon;
        }

        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            applyTheme(true);
        } else {
            applyTheme(false);
        }

const MENU_ICON = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>`;
const CLOSE_ICON = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>`;

window.closeMobileNav = function() {
    const panel = document.getElementById('header-actions');
    const toggle = document.getElementById('mobile-nav-toggle');
    const icon = document.getElementById('mobile-nav-icon');
    if (panel) panel.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (icon) icon.innerHTML = MENU_ICON;
};

window.toggleMobileNav = function() {
    const panel = document.getElementById('header-actions');
    if (!panel) return;
    const willOpen = !panel.classList.contains('is-open');
    panel.classList.toggle('is-open', willOpen);
    const toggle = document.getElementById('mobile-nav-toggle');
    const icon = document.getElementById('mobile-nav-icon');
    if (toggle) toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    if (icon) icon.innerHTML = willOpen ? CLOSE_ICON : MENU_ICON;
};

window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) window.closeMobileNav();
});


        
