document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem('token')) {
        window.location.href = 'index.html';
    }

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const originalText = btn.innerHTML;
    const errorDiv = document.getElementById('login-error');
    
    errorDiv.classList.add('hidden');
    btn.innerHTML = 'Authenticating...';
    btn.disabled = true;

    try {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Authentication failed');
        }

        // Save token and admin info
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify({ username: data.username, role: data.role }));

        showToast('Authentication successful. Redirecting...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);

    } catch (error) {
        errorDiv.querySelector('span').textContent = error.message;
        errorDiv.classList.remove('hidden');
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Add a slight shake animation on failure
        const loginCard = document.querySelector('.bg-white.dark\\:bg-surface-card');
        loginCard.classList.add('animate-shake');
        setTimeout(() => loginCard.classList.remove('animate-shake'), 500);
    }
}
