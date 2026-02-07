// useRegistrationDetail - Hook for fetching and managing registration detail

import { useState, useEffect } from 'react';
import type { Registration } from '@/types/registration.types';

export function useRegistrationDetail(id: string) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRegistration = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/registration/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch registration');
        }

        const data = await response.json();
        setRegistration(data);
      } catch (err) {
        console.error('Error fetching registration:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [id]);

  const handlePrint = () => {
    window.open(`/registration/${id}/print`, '_blank');
  };

  return {
    registration,
    loading,
    error,
    handlePrint,
  };
}
