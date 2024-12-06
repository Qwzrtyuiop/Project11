import { DEBIT_ACCOUNTS } from './constants.js';

export function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    setTimeout(() => {
        errorDiv.textContent = '';
    }, 3000);
}

export function determineDebitCredit(accountType, amount) {
    const isDebit = DEBIT_ACCOUNTS.includes(accountType);
    const isNegative = amount < 0;
    return {
        debit: (isDebit && !isNegative) || (!isDebit && isNegative) ? Math.abs(amount) : 0,
        credit: (isDebit && isNegative) || (!isDebit && !isNegative) ? Math.abs(amount) : 0
    };
}

export function formatAmount(amount) {
    return amount.toFixed(2);
}