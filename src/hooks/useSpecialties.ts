/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { specialtyService } from "../services/specialty.service";
import { Specialties } from "../types/stylist/specialties.types";

export const useSpecialties = (id: string) => {
  const [specialties, setSpecialties] = useState<Specialties[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpecialtiesByHairdresser = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await specialtyService.getSpecialtiesByHairdresser(id);
      console.log(data)
      setSpecialties(data);
    } catch (error: any) {
      console.error("Error fetching specialties:", error);
      setError("No se pudo consultar las especialidades del peluquero");
    } finally {
      setLoading(false);
    }
  };

  return {
    specialties,
    loading,
    error,
    fetchSpecialtiesByHairdresser,
  };
};
