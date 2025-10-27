export const getTable = (headers: (string | number)[], rows: (string | number)[][]) => {
  return [headersToMarkdown(headers), ...rows.map((row) => rowToMarkdown(row))].join('\n');
};

const headersToMarkdown = (headers: (string | number)[]) => {
  const headersRow = headers.map((header) => `| ${header} `).join('') + '|';
  const separatorRow = headers.map(() => '| --- ').join('') + '|';

  return [headersRow, separatorRow].join('\n');
};

const rowToMarkdown = (columns: (string | number)[]) => {
  return columns.map((column) => `| ${column} `).join('') + '|';
};
