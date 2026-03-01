let allMembers = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchMembers();
    
    // Setup Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredMembers = allMembers.filter(member => {
            return member.name.toLowerCase().includes(query) ||
                   member.memberId.toLowerCase().includes(query);
        });
        renderMembersTable(filteredMembers);
    });

    // Setup Form Submit
    document.getElementById('member-form').addEventListener('submit', handleFormSubmit);
});

async function fetchMembers() {
    try {
        const response = await apiFetch(`${API_BASE}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        
        allMembers = await response.json();
        renderMembersTable(allMembers);
    } catch (error) {
        console.error(error);
        showToast('Error loading members from server.', 'error');
        document.getElementById('members-tbody').innerHTML = `
            <tr><td colspan="6" class="px-6 py-4 text-center text-red-500">Failed to load data.</td></tr>
        `;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formError = document.getElementById('form-error');
    const submitBtn = document.getElementById('save-member-btn');
    formError.classList.add('hidden');
    formError.textContent = '';
    
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Saving...';
    submitBtn.disabled = true;

    const mongoId = document.getElementById('member-mongo-id').value;
    const isUpdate = !!mongoId;
    
    const payload = {
        memberId: document.getElementById('memberId').value.trim(),
        name: document.getElementById('name').value.trim(),
        department: document.getElementById('department').value.trim(),
        contact: document.getElementById('contact').value.trim()
    };

    const url = isUpdate ? `${API_BASE}/members/${mongoId}` : `${API_BASE}/members`;
    const method = isUpdate ? 'PUT' : 'POST';

    try {
        const response = await apiFetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Operation failed');
        }

        showToast(`Member successfully ${isUpdate ? 'updated' : 'added'}.`);
        closeMemberModal();
        await fetchMembers();

    } catch (error) {
        console.error('Error saving member:', error);
        formError.classList.remove('hidden');
        formError.textContent = error.message;
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    
    const btn = document.getElementById('confirm-delete-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Deleting...';
    btn.disabled = true;

    try {
        const response = await apiFetch(`${API_BASE}/members/${deleteTargetId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // This is where backend validation for active issued books will trigger a 400 error
            throw new Error(data.message || 'Failed to delete member');
        }

        showToast('Member deleted successfully');
        closeDeleteModal();
        await fetchMembers();

    } catch (error) {
        console.error('Error deleting member:', error);
        // Show as alert/toast for explicit feedback
        showToast(error.message, 'error');
        // Close modal or show error in modal
        closeDeleteModal();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function renderMembersTable(members) {
    const tbody = document.getElementById('members-tbody');
    
    if (members.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No members found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = members.map(member => {
        // active unreturned books count
        const activeIssuesCount = member.issuedBooks ? member.issuedBooks.filter(ib => ib.status !== 'returned').length : 0;
        
        const countBadgeClass = activeIssuesCount > 0 
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
            
        const memberJson = JSON.stringify(member).replace(/"/g, '&quot;');

        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${member.memberId}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-medium">
                    ${member.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${member.department}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${member.contact}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${countBadgeClass}">
                        ${activeIssuesCount}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onclick="openMemberModal(${memberJson})" class="text-gray-900 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
                        Edit
                    </button>
                    <!-- If we wanted to block frontend entirely we could check activeIssuesCount, but relying on backend error is also acceptable + easier here, I will do both -->
                    <button onclick="${activeIssuesCount > 0 ? `showToast('Cannot delete member with active issues', 'error')` : `openDeleteModal('${member._id}')`}" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors ${activeIssuesCount > 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${activeIssuesCount > 0 ? 'title="Has active issues"' : ''}>
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openMemberModal(memberData = null) {
    const modal = document.getElementById('member-modal');
    const form = document.getElementById('member-form');
    const title = document.getElementById('modal-title');
    const mongoIdIp = document.getElementById('member-mongo-id');
    const memberIdIp = document.getElementById('memberId');
    const formError = document.getElementById('form-error');

    form.reset();
    formError.classList.add('hidden');
    formError.textContent = '';

    if (memberData) {
        title.textContent = 'Edit Member';
        mongoIdIp.value = memberData._id;
        memberIdIp.value = memberData.memberId;
        memberIdIp.readOnly = true;
        memberIdIp.classList.add('bg-gray-100', 'dark:bg-gray-600');
        
        document.getElementById('name').value = memberData.name;
        document.getElementById('department').value = memberData.department;
        document.getElementById('contact').value = memberData.contact;
    } else {
        title.textContent = 'Add New Member';
        mongoIdIp.value = '';
        memberIdIp.readOnly = false;
        memberIdIp.classList.remove('bg-gray-100', 'dark:bg-gray-600');
    }

    modal.classList.remove('hidden');
}

function closeMemberModal() {
    document.getElementById('member-modal').classList.add('hidden');
}

function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
    document.getElementById('confirm-delete-btn').onclick = handleConfirmDelete;
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.add('hidden');
}
