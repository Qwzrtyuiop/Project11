import { ENTRIES_PER_PAGE } from './constants.js';
import { formatAmount } from './utils.js';

export class JournalTable {
    constructor() {
        this.currentPage = 1;
        this.journalEntries = [];
    }

    addEntry(entry) {
        this.journalEntries.push(entry);
        this.journalEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
        this.updateTable();
    }

    updateTable() {
        const startIndex = (this.currentPage - 1) * ENTRIES_PER_PAGE;
        const endIndex = startIndex + ENTRIES_PER_PAGE;
        const journalBody = document.getElementById('journalBody');
        journalBody.innerHTML = '';

        for (let i = startIndex; i < Math.min(endIndex, this.journalEntries.length); i++) {
            this.renderEntry(this.journalEntries[i], journalBody);
        }

        this.updatePagination();
    }

    renderEntry(entry, journalBody) {
        // Sort entries to show debits first
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

    updatePagination() {
        const totalPages = Math.ceil(this.journalEntries.length / ENTRIES_PER_PAGE);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = i === this.currentPage ? 'active' : '';
            button.onclick = () => {
                this.currentPage = i;
                this.updateTable();
            };
            pagination.appendChild(button);
        }
    }

    setPage(pageNumber) {
        this.currentPage = pageNumber;
        this.updateTable();
    }
}