let allIssues = [];

document.addEventListener('DOMContentLoaded', () => {
    // Init Due Date logic (14 days from today)
    const dueDateInput = document.getElementById('issue-due-date');
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    dueDateInput.value = defaultDate.toISOString().split('T')[0];

    // Listeners
    document.getElementById('issue-form').addEventListener('submit', handleIssueSubmit);
    document.getElementById('return-form').addEventListener('submit', handleReturnSubmit);
    
    // Search filter for table
    document.getElementById('history-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allIssues.filter(issue => {
            return (issue.issueId || '').toLowerCase().includes(query) ||
                   (issue.bookId?.title || '').toLowerCase().includes(query) ||
                   (issue.memberId?.name || '').toLowerCase().includes(query);
        });
        renderIssuesTable(filtered);
    });

    fetchIssues();
});

async function fetchIssues() {
    try {
        const response = await apiFetch(`${API_BASE}/issues`);
        if (!response.ok) throw new Error('Failed to fetch issues');
        
        allIssues = await response.json();
        renderIssuesTable(allIssues);
    } catch (error) {
        console.error(error);
        showToast('Error loading transaction history.', 'error');
        document.getElementById('issues-tbody').innerHTML = `
            <tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Failed to load data.</td></tr>
        `;
    }
}

async function handleIssueSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('issue-btn');
    const originalText = btn.innerHTML;
    const errorDiv = document.getElementById('issue-error');
    
    // Reset UI
    errorDiv.classList.add('hidden');
    btn.innerHTML = 'Issuing...';
    btn.disabled = true;

    const payload = {
        memberId: document.getElementById('issue-member-id').value.trim(),
        bookId: document.getElementById('issue-book-id').value.trim(),
        dueDate: document.getElementById('issue-due-date').value
    };

    try {
        const response = await apiFetch(`${API_BASE}/issues/issue`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to issue book');
        }

        showToast('Book successfully issued!', 'success');
        document.getElementById('issue-form').reset();
        
        // Reset due date back to 14 days
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 14);
        document.getElementById('issue-due-date').value = defaultDate.toISOString().split('T')[0];

        await fetchIssues();

    } catch (error) {
        console.error(error);
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

async function handleReturnSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('return-btn');
    const originalText = btn.innerHTML;
    const errorDiv = document.getElementById('return-error');
    const successDiv = document.getElementById('return-success');
    
    // Reset UI
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    btn.innerHTML = 'Processing...';
    btn.disabled = true;

    const issueId = document.getElementById('return-issue-id').value.trim();

    try {
        const response = await apiFetch(`${API_BASE}/issues/return/${issueId}`, {
            method: 'PUT'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to return book');
        }

        showToast('Book successfully returned!', 'success');
        document.getElementById('return-form').reset();
        
        // Display fine info if applicable
        if (data.fine > 0) {
            successDiv.innerHTML = `
                <div class="flex">
                    <div class="flex-shrink-0">
                        </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Return Successful</h3>
                        <div class="mt-2 text-sm text-green-700 dark:text-green-300">
                            <p class="font-bold text-lg">Late Return Fine: ${data.fine} units</p>
                            <p>Calculated at 5 units per day overdue.</p>
                        </div>
                    </div>
                </div>
            `;
            successDiv.classList.remove('hidden');
        } else {
             successDiv.innerHTML = `
                <div class="flex items-center text-green-800 dark:text-green-200">
                    <span class="font-medium">Returned on time. No fine.</span>
                </div>
            `;
            successDiv.classList.remove('hidden');
        }

        await fetchIssues();

    } catch (error) {
        console.error(error);
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function renderIssuesTable(issues) {
    const tbody = document.getElementById('issues-tbody');
    
    if (issues.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No transactions found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = issues.map(issue => {
        const issueDate = new Date(issue.issueDate).toLocaleDateString();
        const dueDate = new Date(issue.dueDate).toLocaleDateString();
        const returnDate = issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : 'Pending';
        
        // Status Badges
        const isReturned = issue.status === 'returned';
        const statusClass = isReturned 
            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' 
            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300';
            
        // Check if overdue
        const now = new Date();
        const due = new Date(issue.dueDate);
        const isOverdue = !isReturned && now > due;
        const overdueBadge = isOverdue ? `<span class="px-2 py-0.5 ml-2 inline-flex text-xs leading-5 font-bold rounded-md border text-red-800 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">Overdue</span>` : '';

        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-surface-border/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white group">
                    <span class="font-mono text-xs text-primary-600 dark:text-primary-400 cursor-copy border-b border-dashed border-primary-300 dark:border-primary-700" title="Click to copy for return" onclick="copyToReturn('${issue.issueId || issue._id}')">
                        ${issue.issueId || issue._id.substring(0,8)+'...'}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    <div class="font-medium">${issue.bookId?.title || 'Unknown Title'}</div>
                    <div class="text-xs text-gray-500">${issue.bookId?.bookId || ''}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    <div class="font-medium">${issue.memberId?.name || 'Unknown Member'}</div>
                    <div class="text-xs text-gray-500">${issue.memberId?.memberId || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div class="flex items-center mb-1">
                        <span class="px-2 py-1 inline-flex text-[10px] uppercase font-bold tracking-wider rounded border ${statusClass}">
                            ${issue.status}
                        </span>
                        ${isReturned && issue.fine > 0 ? `<span class="ml-2 px-2 py-1 inline-flex text-[10px] font-bold rounded border text-red-800 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">Fine: ${issue.fine}</span>` : ''}
                    </div>
                    <div class="text-xs mt-2"><span class="text-gray-400">Issued:</span> ${issueDate}</div>
                    <div class="text-xs"><span class="text-gray-400">Due:</span> ${dueDate} ${overdueBadge}</div>
                    ${isReturned ? `<div class="text-xs"><span class="text-gray-400">Returned:</span> ${returnDate}</div>` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// Helper to quickly copy an ID to the return input
function copyToReturn(id) {
    const input = document.getElementById('return-issue-id');
    input.value = id;
    input.focus();
    
    // Visual flash
    input.classList.add('ring-2', 'ring-brand-500');
    setTimeout(() => {
        input.classList.remove('ring-2', 'ring-brand-500');
    }, 500);
}
