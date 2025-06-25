import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CACHE_EXPIRATION } from '../config/config';

export function useCachedFetch<T>(
  url: string,
  cacheKey: string,
  cacheTimeMs: number = CACHE_EXPIRATION,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      try {
        const now = Date.now();

        if (!forceRefresh) {
          const cached = await AsyncStorage.getItem(cacheKey);
          const cachedAt = await AsyncStorage.getItem(`${cacheKey}Timestamp`);

          if (cached && cachedAt && now - Number(cachedAt) < cacheTimeMs) {
            setData(JSON.parse(cached));
            setUpdatedAt(new Date(Number(cachedAt)));
            setLoading(false);
            return;
          }
        }
        const response = await fetch(url);
        const result: T = await response.json();
        setData(result);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
        await AsyncStorage.setItem(`${cacheKey}Timestamp`, now.toString());
        setUpdatedAt(new Date(now));
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, cacheTimeMs, url],
  );

  useEffect(() => {
    fetchData();
  }, [url, cacheKey, fetchData]);

  return { data, loading, error, updatedAt, refetch: () => fetchData(true) };
}
