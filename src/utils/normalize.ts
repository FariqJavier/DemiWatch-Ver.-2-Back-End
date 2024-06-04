export function normalizeString(str: string) {
    // Step 1: Convert to lowercase
    str = str.toLowerCase();
  
    // Step 2: Remove spaces
    str = str.replace(/\s+/g, '');
  
    // Step 3: Remove punctuation
    str = str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '');
  
    return str;
}
  
export function normalizeDate(dateString: Date) {
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