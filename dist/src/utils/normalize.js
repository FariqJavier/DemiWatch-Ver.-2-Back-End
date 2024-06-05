"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDate = exports.normalizeString = void 0;
function normalizeString(str) {
    // Step 1: Convert to lowercase
    str = str.toLowerCase();
    // Step 2: Remove spaces
    str = str.replace(/\s+/g, '');
    // Step 3: Remove punctuation
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '');
    return str;
}
exports.normalizeString = normalizeString;
function normalizeDate(dateString) {
    // Parse the date
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }
    // Format the date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
exports.normalizeDate = normalizeDate;
