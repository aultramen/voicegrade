/**
 * env.js — Runtime environment detection
 */

/** Returns true when running inside a Tauri window */
export const isTauri = () =>
    typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

/**
 * Save text content to a file.
 * - Tauri: opens native save dialog
 * - Browser: triggers download
 * Returns true on success, false if user cancelled (Tauri only).
 */
export async function saveTextFile(content, filename, mime = 'text/plain') {
    if (isTauri()) {
        const { save } = await import('@tauri-apps/plugin-dialog')
        const { writeTextFile } = await import('@tauri-apps/plugin-fs')
        const path = await save({
            defaultPath: filename,
            filters: [{ name: filename.split('.').pop().toUpperCase(), extensions: [filename.split('.').pop()] }],
        })
        if (!path) return false
        await writeTextFile(path, content)
        return true
    } else {
        browserDownload(new Blob([content], { type: mime }), filename)
        return true
    }
}

/**
 * Save binary (Uint8Array) content to a file.
 * - Tauri: opens native save dialog
 * - Browser: triggers download
 */
export async function saveBinaryFile(buffer, filename, filterName = 'File') {
    if (isTauri()) {
        const { save } = await import('@tauri-apps/plugin-dialog')
        const { writeFile } = await import('@tauri-apps/plugin-fs')
        const ext = filename.split('.').pop()
        const path = await save({
            defaultPath: filename,
            filters: [{ name: filterName, extensions: [ext] }],
        })
        if (!path) return false
        await writeFile(path, buffer)
        return true
    } else {
        browserDownload(new Blob([buffer]), filename)
        return true
    }
}

/**
 * Open a file and read its text content.
 * - Tauri: opens native file picker
 * - Browser: shows hidden <input type="file">
 * Returns file text or null if cancelled.
 */
export async function openTextFile(accept = '*') {
    if (isTauri()) {
        const { open } = await import('@tauri-apps/plugin-dialog')
        const { readTextFile } = await import('@tauri-apps/plugin-fs')
        const path = await open({ multiple: false })
        if (!path) return null
        return readTextFile(path)
    } else {
        return new Promise((resolve) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = accept
            input.style.display = 'none'
            document.body.appendChild(input)
            input.onchange = (e) => {
                document.body.removeChild(input)
                const file = e.target.files?.[0]
                if (!file) return resolve(null)
                const reader = new FileReader()
                reader.onload = (ev) => resolve(ev.target.result)
                reader.onerror = () => resolve(null)
                reader.readAsText(file, 'utf-8')
            }
            input.oncancel = () => { document.body.removeChild(input); resolve(null) }
            input.click()
        })
    }
}

/** Internal: trigger browser download from a Blob */
function browserDownload(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
}
