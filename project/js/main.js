import { determineDebitCredit, showError } from './utils.js';
import { addEntry, removeEntry, resetForm } from './entryForm.js';
import { JournalTable } from './journalTable.js';

const journalTable = new JournalTable();

// Make functions available globally for HTML event handlers
window.addEntry = addEntry;
window.removeEntry = removeEntry;
window.submitEntry = submitEntry;

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

    journalTable.addEntry(journalEntry);
    resetForm();
}

// Initialize the form
addEntry();
addEntry();