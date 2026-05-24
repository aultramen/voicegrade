/**
 * storageAdapter.js
 * Runtime-detected storage layer:
 *   - Tauri  → db.js (SQLite via @tauri-apps/plugin-sql)
 *   - Browser → storage.js (localStorage)
 *
 * All exported functions are async so the call-sites stay identical
 * regardless of which backend is active.
 */

import { isTauri } from './env'

// Lazily loaded module reference
let _mod = null

async function getModule() {
    if (_mod) return _mod
    if (isTauri()) {
        _mod = await import('./db')
    } else {
        _mod = await import('./storage')
    }
    return _mod
}

/** Async helper — wraps sync return values in a resolved Promise */
async function call(name, ...args) {
    const m = await getModule()
    const result = m[name](...args)
    return result instanceof Promise ? result : result
}

export async function initDb() {
    const m = await getModule()
    if (typeof m.initDb === 'function') return m.initDb()
    // localStorage backend doesn't need init
}

export const getAllKelas = (...a) => call('getAllKelas', ...a)
export const getKelasById = (...a) => call('getKelasById', ...a)
export const createKelas = (...a) => call('createKelas', ...a)
export const updateKelas = (...a) => call('updateKelas', ...a)
export const deleteKelas = (...a) => call('deleteKelas', ...a)
export const setNilai = (...a) => call('setNilai', ...a)
export const deleteNilai = (...a) => call('deleteNilai', ...a)
