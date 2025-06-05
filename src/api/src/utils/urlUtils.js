// utils/urlUtils.js

const { sendRawCommand } = require('./clientUtils.js');

/**
 * Extract all unique URLs from a given text.
 * Recognizes links starting with "http://", "https://", or "www.".
 */
function extractUrls(text) {
  // This regex matches:
  //   - "http://" or "https://" followed by any non-space characters
  //   - OR "www." followed by any non-space characters
  // The "g" flag makes it global (find all matches), and "i" makes it case-insensitive.
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  const matches = [];
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    matches.push(match[0]);
  }

  // Return only unique URLs
  return Array.from(new Set(matches));
}

/**
 * Validate all extracted URLs from subject + body are not blacklisted.
 * Throws:
 *   - { status: 400, message: 'Blacklisted URL', url } if any URL starts with a "200" response,
 *   - { status: 500, message: 'URL verification service unavailable' } if the check fails at all.
 */
async function validateUrls(subject, body) {
  const urls = extractUrls(`${subject} ${body}`);
  try {
    for (const url of urls) {
      const response = await sendRawCommand(`GET ${url}`);
      // If `response.startsWith('200')`, we consider it blacklisted
      if (response.startsWith('200')) {
        const err = new Error('Blacklisted URL');
        err.status = 400;
        err.url = url;
        throw err;
      }
    }
  } catch (err) {
    if (err.status === 400) {
      throw err; // re-throw blacklist error
    }
    const e = new Error('URL verification service unavailable');
    e.status = 500;
    throw e;
  }
}

module.exports = {
  extractUrls,
  validateUrls,
};
