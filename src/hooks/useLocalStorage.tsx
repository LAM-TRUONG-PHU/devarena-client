import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, id: string, initialValue: T[]) {
    const [storedValue, setStoredValue] = useState<T[]>(() => {
        try {
            const item = window.localStorage.getItem(key);
            const parsedItem = item ? JSON.parse(item) : {};
            return parsedItem[id] || initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T[] | ((val: T[]) => T[])) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            const item = window.localStorage.getItem(key);
            const parsedItem = item ? JSON.parse(item) : {};
            parsedItem[id] = valueToStore;
            window.localStorage.setItem(key, JSON.stringify(parsedItem));
            setStoredValue(valueToStore);
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const;
}

export default useLocalStorage;
