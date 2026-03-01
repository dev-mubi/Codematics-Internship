const API_BASE = 'http://localhost:5000/api';

// --- Auth Management ---
function checkAuth() {
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.pathname.endsWith('login.html');
    
    if (!token && !isLoginPage) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    window.location.href = 'login.html';
}

// Intercepts fetch calls to add the Authorization header automatically
async function apiFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            // Unauthorized, token expired or invalid
            logout();
        }
        return response;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

// --- Theme Management ---
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });
}

// --- Toast Notifications ---
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `flex items-center w-full max-w-sm p-4 text-gray-500 bg-white rounded-xl shadow-lg border border-gray-100 dark:text-gray-300 dark:bg-surface-card dark:border-surface-border transform transition-all duration-300 translate-x-12 opacity-0`;
    
    let iconHtml = '';
    if (type === 'success') {
        iconHtml = `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-600 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400"></div>`;
    } else if (type === 'error') {
        iconHtml = `<div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400"></div>`;
    }

    toast.innerHTML = `
        ${iconHtml}
        <div class="ml-3 text-sm font-medium mr-4">${message}</div>
        <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-surface-card dark:hover:bg-surface-border transition-colors" onclick="this.parentElement.remove()">
            </button>
    `;

    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-12', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-12', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Initialize common features on DOM load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initTheme();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Setup mobile sidebar toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('-translate-x-full');
            sidebarOverlay.classList.toggle('hidden');
        };
        mobileMenuBtn.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
});
