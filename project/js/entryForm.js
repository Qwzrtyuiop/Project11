import { ACCOUNT_OPTIONS } from './constants.js';
import { showError } from './utils.js';
import { setupLiveValidation } from './validation.js';

export function createEntryHTML() {
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
        
        <button type="button" onclick="window.removeEntry(this)" class="btn-remove">×</button>
    `;
}

export function addEntry() {
    const entriesContainer = document.getElementById('entries-container');
    const newEntry = document.createElement('div');
    newEntry.className = 'entry';
    newEntry.innerHTML = createEntryHTML();
    setupLiveValidation(newEntry);
    entriesContainer.appendChild(newEntry);
}

export function removeEntry(button) {
    const entry = button.parentElement;
    if (document.getElementsByClassName('entry').length > 2) {
        entry.remove();
    } else {
        showError('Minimum two entries required');
    }
}

export function resetForm() {
    document.getElementById('date').value = '';
    document.getElementById('entryDescription').value = '';
    const entriesContainer = document.getElementById('entries-container');
    entriesContainer.innerHTML = '';
    
    addEntry();
    addEntry();
}