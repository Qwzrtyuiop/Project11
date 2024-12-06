import { determineDebitCredit } from './utils.js';

export function setupLiveValidation(entry) {
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