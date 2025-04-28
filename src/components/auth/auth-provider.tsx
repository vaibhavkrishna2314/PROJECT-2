import React, { useEffect, useState } from 'react';
import { AuthContext, AuthUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { AppError, handleError } from '@/lib/utils';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string, 
    password: string, 
    role: 'restaurant' | 'ngo', 
    name: string,
    address: string,
    phone: string,
    contactPerson: string,
    operatingHours: string,
    pickupInstructions: string
  ) => {
    try {
      // Verify Supabase client configuration
      if (!supabase.auth) {
        throw new AppError('Authentication service is not configured', {
          code: 'auth_configuration_error'
        });
      }

      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            name,
            address,
            phone,
            "contact_person":contactPerson,
            "operating_hours":operatingHours,
            "pickup_instructions":pickupInstructions
          },
        },
      });

      
      if (signUpError) {
        console.log("SIGNUP ERROR IN SIUPABASE")
        console.log(signUpError)
        throw new AppError(signUpError.message, {
          code: signUpError.name,
          status: signUpError.status,
          details: signUpError
        });
      }

      if (!data.user) {
        throw new AppError('No user data returned from signup', {
          code: 'auth_signup_failed'
        });
      }

      console.log(data);

//       const userId = data.user.id;

//       // Step 1: Check if profile already exists
// const { data: existingProfile, error: fetchProfileError } = await supabase
// .from('profiles')
// .select('*')
// .eq('id', userId)
// .single();

// if (fetchProfileError && fetchProfileError.code !== 'PGRST116') {
// console.error('Error fetching profile:', fetchProfileError);
// throw new Error('Error checking existing profile');
// }

// let profileResponse, profileError;

// if (existingProfile) {
// console.log("Profile already exists. Updating...");
// ({ error: profileError } = await supabase
//   .from('profiles')
//   .update({
//     role,
//     name,
//     address,
//     phone,
//     contactPerson,
//     operatingHours,
//     pickupInstructions
//   })
//   .eq('id', userId));
// } else {
// console.log("Profile not found. Inserting...");
// ({ error: profileError } = await supabase
//   .from('profiles')
//   .insert({
//     id: userId,
//     role,
//     name,
//     address,
//     phone,
//     contactPerson,
//     operatingHours,
//     pickupInstructions
//   }));
// }

// if (profileError) {
// console.log("SIGNUP TABLE ERROR:");
// console.log(profileError);

// try {
//   await supabase.auth.admin.deleteUser(userId);
// } catch (deleteError) {
//   console.error('Failed to cleanup auth user after profile creation failure:', deleteError);
// }

      return data.user;
    } catch (error) {
      throw handleError(error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new AppError(error.message, {
          code: error.name,
          status: error.status,
          details: error
        });
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new AppError(error.message, {
          code: error.name,
          status: error.status,
          details: error
        });
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}