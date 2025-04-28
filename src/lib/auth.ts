import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

export type UserRole = 'restaurant' | 'ngo' | null;

export interface AuthUser extends User {
  role?: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    role: UserRole,
    name: string,
    address: string,
    phone: string,
    contactPerson: string,
    operatingHours: string,
    pickupInstructions: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};