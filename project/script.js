// Constants
const ENTRIES_PER_PAGE = 10;
const DEBIT_ACCOUNTS = ['cash', 'accounts-receivable', 'equipment', 'land-building', 'intangible-assets', 'expense','inventory'];
const CREDIT_ACCOUNTS = ['accounts-payable', 'unearned-revenue', 'capital', 'revenue'];
const ACCOUNT_OPTIONS = [
    { value: 'cash', label: 'Cash' },
    { value: 'accounts-receivable', label: 'Accounts Receivable' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'land-building', label: 'Land and Building' },
    { value: 'intangible-assets', label: 'Intangible Assets' },
    { value: 'accounts-payable', label: 'Accounts Payable' },
    { value: 'unearned-revenue', label: 'Unearned Revenue' },
    { value: 'capital', label: 'Capital' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expense', label: 'Expense' }
];

// Global variables
let journalEntries = [];
let currentPage = 1;

// Utility functions
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    setTimeout(() => {
        errorDiv.textContent = '';
    }, 3000);
}

function determineDebitCredit(accountType, amount) {
    const isDebit = DEBIT_ACCOUNTS.includes(accountType);
    const isNegative = amount < 0;
    return {
        debit: (isDebit && !isNegative) || (!isDebit && isNegative) ? Math.abs(amount) : 0,
        credit: (isDebit && isNegative) || (!isDebit && !isNegative) ? Math.abs(amount) : 0
    };
}

function formatAmount(amount) {
    return amount.toFixed(2);
}

// Entry form functions
function createEntryHTML() {
    const optionsHTML = ACCOUNT_OPTIONS.map(option => 
        `<option value="${option.value}">${option.label}</option>`
    ).join('');

    return `
        <div class="form-group">
            <input type="number" class="pr" placeholder="PR Number" required>
        </div>
        
        <div class="form-group">
            <select class="account-title" required>
                <option value="">Select Account</option>
                ${optionsHTML}
            </select>
            <input type="text" class="description-addon" placeholder="Description" size="15">
        </div>
        
        <div class="form-group amount-group">
            <input type="number" class="amount" step="0.01" placeholder="Amount" required>
        </div>
        
        <button type="button" onclick="removeEntry(this)" class="btn-remove">×</button>
    `;
}

function setupLiveValidation(entry) {
    const amountInput = entry.querySelector('.amount');
    const accountSelect = entry.querySelector('.account-title');
    const debitDisplay = document.createElement('span');
    const creditDisplay = document.createElement('span');
    
    debitDisplay.className = 'amount-display debit';
    creditDisplay.className = 'amount-display credit';
    
    const amountContainer = amountInput.parentElement;
    amountContainer.appendChild(debitDisplay);
    amountContainer.appendChild(creditDisplay);

    function updateDisplay() {
        const amount = parseFloat(amountInput.value) || 0;
        const accountType = accountSelect.value;
        
        if (accountType && !isNaN(amount)) {
            const { debit, credit } = determineDebitCredit(accountType, amount);
            debitDisplay.textContent = debit > 0 ? `Debit: ${debit.toFixed(2)}` : '';
            creditDisplay.textContent = credit > 0 ? `Credit: ${credit.toFixed(2)}` : '';
            
            debitDisplay.style.display = debit > 0 ? 'block' : 'none';
            creditDisplay.style.display = credit > 0 ? 'block' : 'none';
        } else {
            debitDisplay.style.display = 'none';
            creditDisplay.style.display = 'none';
        }
    }

    amountInput.addEventListener('input', updateDisplay);
    accountSelect.addEventListener('change', updateDisplay);
}

function addEntry() {
    const entriesContainer = document.getElementById('entries-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'entry';
    newEntry.innerHTML = createEntryHTML();
    setupLiveValidation(newEntry);
    entriesContainer.appendChild(newEntry);
}

function removeEntry(button) {
    const entry = button.parentElement;
    if (document.getElementsByClassName('entry').length > 2) {
        entry.remove();
    } else {
        showError('Minimum two entries required');
    }
}

function resetForm() {
    document.getElementById('date').value = '';
    document.getElementById('entryDescription').value = '';
    const entriesContainer = document.getElementById('entries-container');
    entriesContainer.innerHTML = '';
    
    addEntry();
    addEntry();
}

// Journal table functions
function renderEntry(entry, journalBody) {
    entry.entries.sort((a, b) => b.debit - a.debit);

    entry.entries.forEach((line, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index === 0 ? entry.date : ''}</td>
            <td>${line.accountTitle}${line.descriptionAddon ? ` (${line.descriptionAddon})` : ''}</td>
            <td>${line.pr}</td>
            <td>${formatAmount(line.debit)}</td>
            <td>${formatAmount(line.credit)}</td>
        `;
        journalBody.appendChild(row);
    });

    const descriptionRow = document.createElement('tr');
    descriptionRow.innerHTML = `
        <td colspan="5">
            <div class="entry-description">${entry.description || ''}</div>
            <div class="entry-spacer"></div>
        </td>
    `;
    journalBody.appendChild(descriptionRow);
}

function updateJournalTable() {
    const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
    const endIndex = startIndex + ENTRIES_PER_PAGE;
    const journalBody = document.getElementById('journalBody');
    journalBody.innerHTML = '';

    for (let i = startIndex; i < Math.min(endIndex, journalEntries.length); i++) {
        renderEntry(journalEntries[i], journalBody);
    }

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(journalEntries.length / ENTRIES_PER_PAGE);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.onclick = () => {
            currentPage = i;
            updateJournalTable();
        };
        pagination.appendChild(button);
    }
}

// Main entry submission function
function submitEntry() {
    const date = document.getElementById('date').value;
    const entries = document.getElementsByClassName('entry');
    const description = document.getElementById('entryDescription').value;
    
    if (!date) {
        showError('Please enter a date');
        return;
    }

    let totalDebit = 0;
    let totalCredit = 0;
    let journalEntry = {
        date: date,
        entries: [],
        description: description
    };

    for (let entry of entries) {
        const pr = entry.querySelector('.pr').value;
        const accountTitle = entry.querySelector('.account-title').value;
        const descriptionAddon = entry.querySelector('.description-addon').value;
        const amount = parseFloat(entry.querySelector('.amount').value);

        if (!pr || !accountTitle || isNaN(amount)) {
            showError('Please fill all fields');
            return;
        }

        const { debit, credit } = determineDebitCredit(accountTitle, amount);
        totalDebit += debit;
        totalCredit += credit;

        journalEntry.entries.push({
            pr,
            accountTitle,
            descriptionAddon,
            debit,
            credit
        });
    }

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        showError('Debits and credits must be equal');
        return;
    }

    journalEntries.push(journalEntry);
    journalEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
    updateJournalTable();
    resetForm();
}

// Initialize the form
document.addEventListener('DOMContentLoaded', () => {
    addEntry();
    addEntry();
});