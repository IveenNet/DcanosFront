/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { userService } from "../services/users.service";
import { User } from "../types/user/user.types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError("No se pudo consultar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (userId: string) => {
    setError(null);
    try {
      const user = await userService.getUserById(userId);
      return user;
    } catch (error: any) {
      console.error("Error fetching user by ID:", error);
      setError("No se pudo obtener el usuario");
      throw error;
    }
  };

  const updateUser = async (userId: string, updatedUser: Partial<User>) => {
    setError(null);
    try {
      console.log(userId)
      console.log(updatedUser)
      const updated = await userService.updateUser(userId, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === updated._id ? updated : user))
      );
    } catch (error: any) {
      console.error("Error updating user:", error);
      setError("Error actualizando el usuario");
    }
  };

  const deleteUser = async (userId: string) => {
    setError(null);
    try {
      await userService.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error: any) {
      console.error("Error deleting user:", error);
      setError("Error eliminando el usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
};
