// Global state to store books for client-side search filtering
let allBooks = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();
    
    // Setup Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredBooks = allBooks.filter(book => {
            return book.title.toLowerCase().includes(query) ||
                   book.author.toLowerCase().includes(query) ||
                   book.bookId.toLowerCase().includes(query);
        });
        renderBooksTable(filteredBooks);
    });

    // Setup Form Submit
    document.getElementById('book-form').addEventListener('submit', handleFormSubmit);
});

// --- API Calls ---

async function fetchBooks() {
    try {
        const response = await apiFetch(`${API_BASE}/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
        
        allBooks = await response.json();
        renderBooksTable(allBooks);
    } catch (error) {
        console.error(error);
        showToast('Error loading books from server.', 'error');
        document.getElementById('books-tbody').innerHTML = `
            <tr><td colspan="7" class="px-6 py-4 text-center text-red-500">Failed to load data.</td></tr>
        `;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formError = document.getElementById('form-error');
    const submitBtn = document.getElementById('save-book-btn');
    formError.classList.add('hidden');
    formError.textContent = '';
    
    // Switch to loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Saving...';
    submitBtn.disabled = true;

    const mongoId = document.getElementById('book-mongo-id').value;
    const isUpdate = !!mongoId;
    
    const payload = {
        bookId: document.getElementById('bookId').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value.trim(),
        quantity: parseInt(document.getElementById('quantity').value, 10)
    };

    const url = isUpdate ? `${API_BASE}/books/${mongoId}` : `${API_BASE}/books`;
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

        showToast(`Book successfully ${isUpdate ? 'updated' : 'added'}.`);
        closeBookModal();
        await fetchBooks(); // Refresh table

    } catch (error) {
        console.error('Error saving book:', error);
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
        const response = await apiFetch(`${API_BASE}/books/${deleteTargetId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete book');
        }

        showToast('Book deleted successfully');
        closeDeleteModal();
        await fetchBooks();

    } catch (error) {
        console.error('Error deleting book:', error);
        showToast(error.message, 'error');
        closeDeleteModal();
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// --- DOM Manipulation & Modals ---

function renderBooksTable(books) {
    const tbody = document.getElementById('books-tbody');
    
    if (books.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No books found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = books.map(book => {
        // Status Badges
        const isAvailable = book.availabilityStatus;
        const statusClass = isAvailable 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        const statusLabel = isAvailable ? 'Available' : 'Unavailable';
        
        // Pass JSON string to onClick for edit
        const bookJson = JSON.stringify(book).replace(/"/g, '&quot;');

        return `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${book.bookId}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 font-medium">
                    ${book.title}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${book.author}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    ${book.category}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                    ${book.quantity}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${statusLabel}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onclick="openBookModal(${bookJson})" class="text-gray-900 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition-colors">
                        Edit
                    </button>
                    <button onclick="openDeleteModal('${book._id}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openBookModal(bookData = null) {
    const modal = document.getElementById('book-modal');
    const form = document.getElementById('book-form');
    const title = document.getElementById('modal-title');
    const mongoIdIp = document.getElementById('book-mongo-id');
    const bookIdIp = document.getElementById('bookId');
    const formError = document.getElementById('form-error');

    form.reset();
    formError.classList.add('hidden');
    formError.textContent = '';

    if (bookData) {
        // Edit Mode
        title.textContent = 'Edit Book';
        mongoIdIp.value = bookData._id;
        bookIdIp.value = bookData.bookId;
        bookIdIp.readOnly = true; // Usually shouldn't change ID easily, but API supports it.
        bookIdIp.classList.add('bg-gray-100', 'dark:bg-gray-600');
        
        document.getElementById('title').value = bookData.title;
        document.getElementById('author').value = bookData.author;
        document.getElementById('category').value = bookData.category;
        document.getElementById('quantity').value = bookData.quantity;
    } else {
        // Add Mode
        title.textContent = 'Add New Book';
        mongoIdIp.value = '';
        bookIdIp.readOnly = false;
        bookIdIp.classList.remove('bg-gray-100', 'dark:bg-gray-600');
    }

    modal.classList.remove('hidden');
}

function closeBookModal() {
    document.getElementById('book-modal').classList.add('hidden');
}

function openDeleteModal(id) {
    deleteTargetId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
    
    // Attach listener fresh to avoid duplicates if not careful, but inline onclick in HTML is easier
    document.getElementById('confirm-delete-btn').onclick = handleConfirmDelete;
}

function closeDeleteModal() {
    deleteTargetId = null;
    document.getElementById('delete-modal').classList.add('hidden');
}
