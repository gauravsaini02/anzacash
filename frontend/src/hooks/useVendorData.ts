import { useState, useEffect } from 'react';
import vendorService, { VendorData, VendorStats } from '../services/vendorService';

export const useVendorData = () => {
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [vendorStats, setVendorStats] = useState<VendorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both vendor profile and stats in parallel
        const [profileData, statsData] = await Promise.all([
          vendorService.getVendorProfile(),
          vendorService.getVendorStats()
        ]);

        setVendorData(profileData);
        setVendorStats(statsData);
      } catch (err) {
        console.error('Failed to fetch vendor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const refetchData = () => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileData, statsData] = await Promise.all([
          vendorService.getVendorProfile(),
          vendorService.getVendorStats()
        ]);

        setVendorData(profileData);
        setVendorStats(statsData);
      } catch (err) {
        console.error('Failed to fetch vendor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load vendor data');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  };

  return {
    vendorData,
    vendorStats,
    loading,
    error,
    refetchData,
    formatBalance: vendorService.formatBalance,
    formatCurrency: vendorService.formatCurrency
  };
};