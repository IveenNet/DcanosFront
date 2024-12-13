import { useEffect, useState } from 'react';
import { stylistService } from '../services/stylist.service';
import { Stylist } from '../types/stylist/stylist.types';

export const useStylists = () => {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const data = await stylistService.getStylists();
        setStylists(data);
      } catch (err) {
        console.error(err);
        setError("Se produjo un error");
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  // Opción para forzar la actualización
  const refreshStylists = async () => {
    setLoading(true);
    try {
      const data = await stylistService.getStylists(true);
      setStylists(data);
    } catch (err) {
      console.error(err);
      setError('Error refreshing stylists');
    } finally {
      setLoading(false);
    }
  };

  return { stylists, loading, error, refreshStylists };
};
