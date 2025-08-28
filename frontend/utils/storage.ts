/**
 * Safe storage utilities to handle localStorage/sessionStorage quota exceeded errors
 */

export interface StorageItem {
  [key: string]: any
}

/**
 * Safely set item in sessionStorage with error handling
 */
export const setSessionStorageItem = (key: string, value: any): boolean => {
  try {
    const serializedValue = JSON.stringify(value)
    sessionStorage.setItem(key, serializedValue)
    return true
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        console.warn(`SessionStorage quota exceeded when storing '${key}'. Clearing old data.`)
        // Try to clear some space and retry
        clearOldSessionData()
        try {
          sessionStorage.setItem(key, JSON.stringify(value))
          return true
        } catch (retryError) {
          console.error(`Failed to store '${key}' even after clearing old data:`, retryError)
        }
      } else {
        console.error(`Error storing '${key}' in sessionStorage:`, error)
      }
    }
    return false
  }
}

/**
 * Safely get item from sessionStorage with error handling
 */
export const getSessionStorageItem = <T = any>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Error retrieving '${key}' from sessionStorage:`, error)
    // Remove corrupted item
    sessionStorage.removeItem(key)
    return null
  }
}

/**
 * Clear old session data to free up space
 */
const clearOldSessionData = (): void => {
  try {
    const keysToCheck = ['searchState', 'filterState', 'tempData']
    
    for (const key of keysToCheck) {
      const item = sessionStorage.getItem(key)
      if (item) {
        try {
          const data = JSON.parse(item)
          // Remove items older than 1 hour
          if (data.timestamp && Date.now() - data.timestamp > 3600000) {
            sessionStorage.removeItem(key)
            console.log(`Removed old sessionStorage item: ${key}`)
          }
        } catch (parseError) {
          // Remove corrupted items
          sessionStorage.removeItem(key)
          console.log(`Removed corrupted sessionStorage item: ${key}`)
        }
      }
    }
  } catch (error) {
    console.error('Error clearing old session data:', error)
  }
}

/**
 * Get storage usage information
 */
export const getStorageUsage = (): { used: number; available: number } => {
  let used = 0
  let available = 0
  
  try {
    // Estimate current usage
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        used += sessionStorage[key].length + key.length
      }
    }
    
    // Try to estimate available space (rough approximation)
    const testKey = 'storage-test'
    const testData = 'x'.repeat(1024) // 1KB test
    let testSize = 1024
    
    try {
      while (testSize < 10 * 1024 * 1024) { // Max 10MB test
        sessionStorage.setItem(testKey, 'x'.repeat(testSize))
        sessionStorage.removeItem(testKey)
        testSize *= 2
      }
      available = testSize / 2
    } catch {
      available = testSize / 2
    }
    
    sessionStorage.removeItem(testKey)
  } catch (error) {
    console.error('Error calculating storage usage:', error)
  }
  
  return { used, available }
}

/**
 * Store minimal search state to avoid quota issues
 */
export const storeSearchState = (hasSearched: boolean, recordCount: number = 0): boolean => {
  const minimalState = {
    hasSearched,
    recordCount,
    timestamp: Date.now()
  }
  
  return setSessionStorageItem('searchState', minimalState)
}

/**
 * Retrieve search state
 */
export const getSearchState = (): { hasSearched: boolean; recordCount: number } | null => {
  const state = getSessionStorageItem('searchState')
  
  if (state && state.timestamp && Date.now() - state.timestamp < 3600000) {
    return {
      hasSearched: state.hasSearched || false,
      recordCount: state.recordCount || 0
    }
  }
  
  return null
}
