const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);

function walk(directory) {
    let results = [];
    const list = fs.readdirSync(directory);
    list.forEach(file => {
        file = path.join(directory, file);
        if (fs.statSync(file).isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(dir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Restore the Theme Toggle & Hamburger menu icon SVG
    // Because I wiped out all icons earlier, the buttons became empty invisible targets.
    
    // Theme Button SVG (Moon/Sun)
    const themeBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden dark:block"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="block dark:hidden"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    content = content.replace(/<button id="theme-toggle"[^>]*>\s*<\/button>/g, `<button id="theme-toggle" class="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">${themeBtnSvg}</button>`);

    // Mobile Hamburger SVG
    const hamburgerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    content = content.replace(/<button id="mobile-menu-btn"[^>]*>\s*<\/button>/g, `<button id="mobile-menu-btn" class="lg:hidden text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white focus:outline-none p-2 mr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">${hamburgerSvg}</button>`);

    // 2. Fix Custom Colors for High Contrast Dark Mode (Black background, White UI)
    content = content.replace(
        /colors: \{\s*primary: \{[^}]+\},\s*surface: \{[^}]+\}\s*\}/,
        `colors: {
                        primary: { 50: '#f9fafb', 100: '#f3f4f6', 500: '#374151', 600: '#000000', 700: '#000000', 900: '#000000', dark: '#ffffff' },
                        surface: { dark: '#000000', card: '#111111', border: '#333333' }
                    }`
    );

    // Swap purple/indigo primary texts out for black/white themes
    content = content.replace(/text-primary-600/g, 'text-black dark:text-white');
    content = content.replace(/text-primary-700/g, 'text-black dark:text-gray-300');
    content = content.replace(/bg-primary-600/g, 'bg-black dark:bg-white');
    content = content.replace(/hover:bg-primary-700/g, 'hover:bg-gray-800 dark:hover:bg-gray-200');
    // Button text colors specifically on dark backgrounds need inverse
    content = content.replace(/bg-black dark:bg-white text-white/g, 'bg-black dark:bg-white text-white dark:text-black');
    content = content.replace(/text-white bg-primary-600/g, 'text-white dark:text-black bg-black dark:bg-white');
    content = content.replace(/bg-primary-50 text-black dark:text-white dark:bg-primary-900\/30 dark:text-primary-400/g, 'bg-gray-200 text-black dark:bg-[#222] dark:text-white');
    
    // Fix headers/text in dark mode to be absolutely white instead of gray-100 sometimes
    content = content.replace(/dark:text-gray-100/g, 'dark:text-white');
    content = content.replace(/dark:bg-surface-dark\/50/g, 'dark:bg-black');

    fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed themes and restored essential SVGs');
