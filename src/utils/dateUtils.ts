/**
 * Date Utility for Thai Buddhist Era (พ.ศ.)
 * Current year 2026 CE -> 2569 BE
 */

/**
 * Returns today's date formatted as DD/MM/YYYY in Thai Buddhist Era (พ.ศ.)
 */
export const getTodayThaiBE = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const yearBE = now.getFullYear() + 543;
  return `${day}/${month}/${yearBE}`;
};

/**
 * Normalizes any date string (ISO YYYY-MM-DD, DD/MM/YYYY, or Date object) into DD/MM/YYYY in พ.ศ.
 */
export const formatToThaiBE = (inputStr?: string | Date | null): string => {
  if (!inputStr) return getTodayThaiBE();

  if (inputStr instanceof Date) {
    const day = String(inputStr.getDate()).padStart(2, '0');
    const month = String(inputStr.getMonth() + 1).padStart(2, '0');
    let year = inputStr.getFullYear();
    if (year < 2400) year += 543;
    return `${day}/${month}/${year}`;
  }

  const str = String(inputStr).trim();

  // Already DD/MM/YYYY (พ.ศ.)
  const thMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (thMatch) {
    const day = thMatch[1].padStart(2, '0');
    const month = thMatch[2].padStart(2, '0');
    let year = parseInt(thMatch[3], 10);
    if (year < 2400) year += 543;
    return `${day}/${month}/${year}`;
  }

  // HTML Date Input Format: YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    let year = parseInt(isoMatch[1], 10);
    if (year < 2400) year += 543;
    const month = isoMatch[2];
    const day = isoMatch[3];
    return `${day}/${month}/${year}`;
  }

  // Fallback try standard JS Date parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    let year = d.getFullYear();
    if (year < 2400) year += 543;
    return `${day}/${month}/${year}`;
  }

  return str;
};

/**
 * Converts a DD/MM/YYYY (พ.ศ.) string into YYYY-MM-DD (ค.ศ.) for <input type="date">
 */
export const thaiBEToISODate = (thaiDateStr?: string): string => {
  if (!thaiDateStr) return '';
  const match = String(thaiDateStr).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return '';
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  let year = parseInt(match[3], 10);
  if (year > 2400) year -= 543; // Convert พ.ศ. back to ค.ศ. for input[type="date"]
  return `${year}-${month}-${day}`;
};

/**
 * Normalizes year in a DD/MM/YYYY string to the current Buddhist Era year (2569 / 2026)
 */
export const convertYearToCurrentBE = (dateStr?: string, defaultCurrent: boolean = true): string => {
  const currentBEYear = new Date().getFullYear() + 543; // 2569
  if (!dateStr || dateStr.trim() === '') {
    return defaultCurrent ? getTodayThaiBE() : '';
  }

  const match = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].padStart(2, '0');
    let year = parseInt(match[3], 10);
    // If year is outdated (e.g. 2567 or 2024), convert to current BE year 2569
    if (year < 2400) {
      year += 543;
    }
    if (year < currentBEYear - 1) {
      year = currentBEYear;
    }
    return `${day}/${month}/${year}`;
  }

  return formatToThaiBE(dateStr);
};
