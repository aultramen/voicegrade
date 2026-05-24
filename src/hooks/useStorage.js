/**
 * useStorage.js — Async React hook wrapping storageAdapter
 * Auto-detects runtime: SQLite (Tauri) or localStorage (Browser)
 */

import { useState, useCallback, useEffect } from 'react'
import {
    initDb,
    getAllKelas as getAllKelasDb,
    getKelasById,
    createKelas,
    updateKelas as updateKelasDb,
    deleteKelas as deleteKelasDb,
    setNilai as setNilaiDb,
    deleteNilai as deleteNilaiDb,
} from '../utils/storageAdapter'


export function useStorage() {
    const [, forceUpdate] = useState(0)
    const [dbReady, setDbReady] = useState(false)

    // Initialize DB on first mount
    useEffect(() => {
        initDb().then(() => setDbReady(true)).catch(console.error)
    }, [])

    const refresh = useCallback(() => forceUpdate(n => n + 1), [])

    const getAllKelas = useCallback(async () => {
        return getAllKelasDb()
    }, [])

    const getKelas = useCallback(async (id) => {
        return getKelasById(id)
    }, [])

    const addKelas = useCallback(async ({ nama }) => {
        const k = await createKelas({ nama })
        refresh()
        return k
    }, [refresh])

    const updateKelas = useCallback(async (id, updates) => {
        const k = await updateKelasDb(id, updates)
        refresh()
        return k
    }, [refresh])

    const deleteKelas = useCallback(async (id) => {
        await deleteKelasDb(id)
        refresh()
    }, [refresh])

    const setNilai = useCallback(async (kelasId, mapel, siswa, nilai) => {
        await setNilaiDb(kelasId, mapel, siswa, nilai)
        refresh()
    }, [refresh])

    const deleteNilai = useCallback(async (kelasId, mapel, siswa) => {
        await deleteNilaiDb(kelasId, mapel, siswa)
        refresh()
    }, [refresh])

    return {
        dbReady,
        getAllKelas,
        getKelas,
        addKelas,
        updateKelas,
        deleteKelas,
        setNilai,
        deleteNilai,
        refresh,
    }
}
