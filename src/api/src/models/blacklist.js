// src/api/src/models/blacklist.js

let nextId = 1;
const store = new Map(); // id → url

/**
 * Add a new URL to the blacklist.
 * And return the entry { id, url }.
 */
function create(url) {
  const id = nextId++;
  store.set(id, url);
  return { id, url };
}

/**
 * Return the URL associated with the ID, or null if absent.
 *
 */
function getById(id) {
  return store.has(id) ? store.get(id) : null;
}

/**
 * Remove the entry id → url from the list.
 * Return true if the entry was found and removed, false otherwise.
 */
function remove(id) {
  return store.delete(id);
}

module.exports = { create, getById, remove };
