/**
 * Triggers a file download in the browser for air-gapped offline usage.
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/html') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the currently running HTML document as a standalone offline file.
 */
export function downloadCurrentPageAsOfflineHtml(filename: string = 'deck-entropy-bitcoin-seed-generator.html') {
  const htmlContent = document.documentElement.outerHTML;
  downloadFile(filename, `<!DOCTYPE html>\n${htmlContent}`);
}
