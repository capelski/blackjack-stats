export const tableFormat: 'csv' | 'markdown' = 'markdown';

export const getTable = (headers: (string | number)[], rows: (string | number)[][]) => {
  const lines =
    tableFormat === 'markdown'
      ? [...headersToMarkdown(headers), ...rows.map((row) => rowToMarkdown(row))]
      : [headersToCsv(headers), ...rows.map((row) => rowToCsv(row))];

  return lines.join('\n');
};

const headersToCsv = (headers: (string | number)[]) => {
  return `${headers.join(',')}`;
};

const headersToMarkdown = (headers: (string | number)[]) => {
  const headersRow = headers.map((header) => `| ${header} `).join('') + '|';
  const separatorRow = headers.map(() => '| --- ').join('') + '|';

  return [headersRow, separatorRow];
};

const rowToCsv = (columns: (string | number)[]) => {
  return columns.map((column) => (String(column).includes(',') ? `"${column}"` : column)).join(',');
};

const rowToMarkdown = (columns: (string | number)[]) => {
  return columns.map((column) => `| ${column} `).join('') + '|';
};
