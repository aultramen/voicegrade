/**
 * useFuzzyMatch.js — Fuse.js-based fuzzy name matching hook
 */

import { useMemo } from 'react'
import Fuse from 'fuse.js'

/**
 * @param {string[]} studentList
 * @returns {{ search: (query: string) => FuseResult[] }}
 */
export function useFuzzyMatch(studentList) {
    const fuse = useMemo(() => {
        if (!studentList || studentList.length === 0) return null
        return new Fuse(studentList, {
            threshold: 0.4,       // 0 = exact, 1 = anything
            distance: 100,
            minMatchCharLength: 2,
            includeScore: true,
        })
    }, [studentList])

    /**
     * Search for a name and return top 3 matches.
     * Each result: { item: string, score: number }
     * Lower score = better match (Fuse.js convention)
     */
    const search = (query) => {
        if (!fuse || !query || query.trim().length < 2) return []
        const results = fuse.search(query.trim())
        return results.slice(0, 3)
    }

    return { search }
}
