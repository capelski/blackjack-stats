export const headersToMarkdown = (headers: string[]) => {
  const headersRow = headers.map((header) => `| ${header} `).join('') + '|';
  const separatorRow = headers.map(() => '| --- ').join('') + '|';

  return [headersRow, separatorRow].join('\n');
};

export const rowToMarkdown = (columns: (string | number)[]) => {
  return columns.map((column) => `| ${column} `).join('') + '|';
};
