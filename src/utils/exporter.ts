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
 * Strips sensitive runtime state from a serialized HTML document, so the
 * exported standalone file never contains seed material in plaintext:
 *
 * 1. Revealed mnemonic words (word tile rendered before its "idx: N" marker);
 * 2. Values of form inputs (BIP-39 passphrase) — serialized DOM keeps them
 *    as value attributes/text;
 * 3. Long hex strings (master 512-bit seed = 128 hex chars, entropy digest
 *    = 64 hex chars) rendered anywhere in the DOM.
 *
 * The exported HTML embeds the full application bundle, so on reopen the app
 * starts fresh in its default masked state — no functionality lost.
 */
export function sanitizeExportedHtml(html: string): string {
  let sanitized = html;

  // 1. Revealed mnemonic tiles: the word sits in a div immediately followed
  //    by the div carrying the "idx: N" marker. Masked tiles render '••••••'
  //    and are left untouched.
  sanitized = sanitized.replace(
    />([a-z]+)(<\/div><div[^>]*>idx: \d+)/g,
    '>••••••$2'
  );

  // 2. Input values (BIP-39 passphrase and any other typed secret).
  sanitized = sanitized.replace(/(<input[^>]*\bvalue=")[^"]*(")/g, '$1$2');
  sanitized = sanitized.replace(/(<textarea[^>]*>)[^<]*(<\/textarea>)/g, '$1$2');

  // 3. Long hex strings (>= 64 hex chars): master seed and entropy digests.
  sanitized = sanitized.replace(/[0-9a-f]{64,}/gi, '•'.repeat(64));

  return sanitized;
}

/**
 * Downloads the currently running HTML document as a standalone offline file.
 * The exported file is sanitized: any seed material currently rendered in the
 * DOM (revealed mnemonic, passphrase, master seed hex) is stripped so it never
 * reaches disk in plaintext.
 */
export function downloadCurrentPageAsOfflineHtml(filename: string = 'deck-entropy-bitcoin-seed-generator.html') {
  const htmlContent = document.documentElement.outerHTML;
  downloadFile(filename, sanitizeExportedHtml(`<!DOCTYPE html>\n${htmlContent}`));
}