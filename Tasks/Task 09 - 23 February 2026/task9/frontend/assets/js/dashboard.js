// API_BASE is defined in common.js but recommended to be explicitly destructured or aliased per file if desired.
// We'll rely on the global API_BASE from common.js.

document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardData();
});

async function fetchDashboardData() {
    try {
        // Fetch data in parallel for efficiency using apiFetch for Auth headers
        const [booksRes, membersRes, issuesRes] = await Promise.all([
            apiFetch(`${API_BASE}/books`),
            apiFetch(`${API_BASE}/members`),
            apiFetch(`${API_BASE}/issues`)
        ]);

        if (!booksRes.ok || !membersRes.ok || !issuesRes.ok) {
            throw new Error('Failed to fetch data from API');
        }

        const books = await booksRes.json();
        const members = await membersRes.json();
        const issues = await issuesRes.json();

        // Calculate statistics
        const totalBooks = books.length;
        const availableBooks = books.filter(b => b.availabilityStatus).length;
        const totalMembers = members.length;
        const activeIssues = issues.filter(i => i.status === 'issued').length;

        // Update DOM
        animateValue("stat-total-books", 0, totalBooks, 1000);
        animateValue("stat-available-books", 0, availableBooks, 1000);
        animateValue("stat-total-members", 0, totalMembers, 1000);
        animateValue("stat-active-issues", 0, activeIssues, 1000);

        // Populate Recent Activity Table (latest 5 issues)
        populateRecentActivity(issues.slice(0, 5));

    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Error loading dashboard data. Please make sure the server is running.', 'error');
        document.getElementById('recent-activity-tbody').innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-sm text-red-500">
                    Failed to load data. Backend might be unreachable.
                </td>
            </tr>
        `;
    }
}

function populateRecentActivity(recentIssues) {
    const tbody = document.getElementById('recent-activity-tbody');
    
    if (recentIssues.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent issue records found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recentIssues.map((issue, index) => {
        const issueDate = new Date(issue.issueDate).toLocaleDateString();
        const dueDate = new Date(issue.dueDate).toLocaleDateString();
        
        // Status Badge
        const statusClass = issue.status === 'returned' 
            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300';
        const statusLabel = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);

        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-surface-border/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${issue.bookId?.title || 'Unknown Book'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    ${issue.memberId?.name || 'Unknown Member'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span class="block">Iss: ${issueDate}</span>
                    <span class="block">Due: ${dueDate}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2.5 py-1 inline-flex text-xs font-semibold rounded-lg border ${statusClass}">
                        ${statusLabel}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// Helper to animate numbers cleanly
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (start === end) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing out quad
        const easeProgress = progress * (2 - progress);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}
