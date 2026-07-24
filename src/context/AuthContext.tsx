import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export type UserRole = 'customer' | 'admin' | 'manager' | 'viewer';

export interface UserAddress {
  id: string;
  title: string; // e.g., 'Home', 'Shop / Office'
  recipientName: string;
  phone: string;
  addressLine: string;
  wardNo: string;
  city: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  addresses: UserAddress[];
  wishlist: string[]; // array of product IDs
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: UserRole;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    address?: string
  ) => Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  saveAddress: (address: UserAddress) => void;
  deleteAddress: (addressId: string) => void;
  loginAsDemoCustomer: () => void;
  loginAsDemoAdmin: (role?: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'manas_auth_user_v2';
const REMEMBER_ME_KEY = 'manas_remember_me';

const DEFAULT_DEMO_CUSTOMER: UserProfile = {
  id: 'cust-demo-101',
  email: 'customer@manastraders.com.np',
  fullName: 'Ram Bahadur Shrestha',
  phone: '9848501234',
  role: 'customer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  addresses: [
    {
      id: 'addr-1',
      title: 'Home (Tikapur Hospital Road)',
      recipientName: 'Ram Bahadur Shrestha',
      phone: '9848501234',
      addressLine: 'Hospital Line Near Eye Care Center',
      wardNo: 'Tikapur-01',
      city: 'Tikapur, Kailali',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'Retail Shop / Store',
      recipientName: 'Shrestha Kirana Store',
      phone: '9848501234',
      addressLine: 'Main Market Road, Block A',
      wardNo: 'Tikapur-01',
      city: 'Tikapur, Kailali',
      isDefault: false,
    },
  ],
  wishlist: ['prod-1', 'prod-3', 'prod-6'],
  emailVerified: true,
  createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_CUSTOMER;
    } catch {
      return DEFAULT_DEMO_CUSTOMER;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);

  // Sync Supabase Auth state if configured
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured()) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user && mounted) {
            const sbUser = data.session.user;
            const profile: UserProfile = {
              id: sbUser.id,
              email: sbUser.email || '',
              fullName: sbUser.user_metadata?.full_name || 'Valued Customer',
              phone: sbUser.user_metadata?.phone || '9848500000',
              role: (sbUser.user_metadata?.role as UserRole) || 'customer',
              avatarUrl: sbUser.user_metadata?.avatar_url,
              addresses: sbUser.user_metadata?.addresses || DEFAULT_DEMO_CUSTOMER.addresses,
              wishlist: sbUser.user_metadata?.wishlist || DEFAULT_DEMO_CUSTOMER.wishlist,
              emailVerified: Boolean(sbUser.email_confirmed_at),
              createdAt: sbUser.created_at || new Date().toISOString(),
            };
            setUser(profile);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Supabase auth session sync failed:', err);
        }
      }
      if (mounted) setLoading(false);
    }

    initAuth();

    if (isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const sbUser = session.user;
          const profile: UserProfile = {
            id: sbUser.id,
            email: sbUser.email || '',
            fullName: sbUser.user_metadata?.full_name || 'Valued Customer',
            phone: sbUser.user_metadata?.phone || '9848500000',
            role: (sbUser.user_metadata?.role as UserRole) || 'customer',
            avatarUrl: sbUser.user_metadata?.avatar_url,
            addresses: sbUser.user_metadata?.addresses || [],
            wishlist: sbUser.user_metadata?.wishlist || [],
            emailVerified: Boolean(sbUser.email_confirmed_at),
            createdAt: sbUser.created_at || new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        }
      });

      return () => {
        mounted = false;
        authListener.subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const saveUserToStateAndStorage = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  };

  // Register Customer
  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    addressLine?: string
  ): Promise<{ success: boolean; error?: string; requiresEmailVerification?: boolean }> => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              role: 'customer',
              addresses: addressLine
                ? [
                    {
                      id: `addr-${Date.now()}`,
                      title: 'Home Address',
                      recipientName: fullName,
                      phone,
                      addressLine,
                      wardNo: 'Tikapur-01',
                      city: 'Tikapur, Kailali',
                      isDefault: true,
                    },
                  ]
                : [],
              wishlist: [],
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const isVerified = Boolean(data.user.email_confirmed_at);
          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName,
            phone,
            role: 'customer',
            addresses: addressLine
              ? [
                  {
                    id: `addr-${Date.now()}`,
                    title: 'Home Address',
                    recipientName: fullName,
                    phone,
                    addressLine,
                    wardNo: 'Tikapur-01',
                    city: 'Tikapur, Kailali',
                    isDefault: true,
                  },
                ]
              : [],
            wishlist: [],
            emailVerified: isVerified,
            createdAt: new Date().toISOString(),
          };
          saveUserToStateAndStorage(newUser);

          return {
            success: true,
            requiresEmailVerification: !isVerified,
          };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed' };
      }
    }

    // Local Demo Registration Fallback
    const demoUser: UserProfile = {
      id: `cust-${Date.now()}`,
      email,
      fullName,
      phone,
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      addresses: addressLine
        ? [
            {
              id: `addr-${Date.now()}`,
              title: 'Home Address',
              recipientName: fullName,
              phone,
              addressLine,
              wardNo: 'Tikapur-01',
              city: 'Tikapur, Kailali',
              isDefault: true,
            },
          ]
        : [],
      wishlist: [],
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    saveUserToStateAndStorage(demoUser);
    return { success: true };
  };

  // Login Customer or Admin
  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Check Demo Admin logins
    if (email.trim().toLowerCase() === 'admin@manastraders.com' && (password === 'admin123' || password === 'admin')) {
      loginAsDemoAdmin('admin');
      return { success: true };
    }
    if (email.trim().toLowerCase() === 'manager@manastraders.com' && (password === 'manager123' || password === 'manager')) {
      loginAsDemoAdmin('manager');
      return { success: true };
    }

    // Check Demo Customer login
    if (email.trim().toLowerCase() === 'customer@manastraders.com.np' || email.trim().toLowerCase() === 'customer@manastraders.com') {
      loginAsDemoCustomer();
      return { success: true };
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_ME_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const sbUser = data.user;
          const profile: UserProfile = {
            id: sbUser.id,
            email: sbUser.email || email,
            fullName: sbUser.user_metadata?.full_name || 'Valued Customer',
            phone: sbUser.user_metadata?.phone || '9848501234',
            role: (sbUser.user_metadata?.role as UserRole) || 'customer',
            avatarUrl: sbUser.user_metadata?.avatar_url,
            addresses: sbUser.user_metadata?.addresses || [],
            wishlist: sbUser.user_metadata?.wishlist || [],
            emailVerified: Boolean(sbUser.email_confirmed_at),
            createdAt: sbUser.created_at || new Date().toISOString(),
          };
          saveUserToStateAndStorage(profile);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    // Fallback login if non-empty password
    if (password.length >= 4) {
      const fallbackUser: UserProfile = {
        ...DEFAULT_DEMO_CUSTOMER,
        email,
        fullName: email.split('@')[0],
      };
      saveUserToStateAndStorage(fallbackUser);
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials. Password must be at least 4 characters.' };
  };

  // Forgot Password
  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#/reset-password`,
        });
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Password reset link sent to your email address.' };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to send reset email' };
      }
    }

    return {
      success: true,
      message: 'Demo mode: Password reset instructions simulated. You can log in using your email.',
    };
  };

  // Reset Password
  const resetPassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
    return { success: true };
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout failed:', err);
      }
    }
    saveUserToStateAndStorage(null);
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not logged in' };

    const updatedUser = { ...user, ...updates };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: {
            full_name: updatedUser.fullName,
            phone: updatedUser.phone,
            avatar_url: updatedUser.avatarUrl,
            addresses: updatedUser.addresses,
            wishlist: updatedUser.wishlist,
          },
        });
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    saveUserToStateAndStorage(updatedUser);
    return { success: true };
  };

  // Change Password
  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'User not authenticated' };
    if (newPassword.length < 6) return { success: false, error: 'New password must be at least 6 characters.' };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    return { success: true };
  };

  // Wishlist Toggle
  const toggleWishlist = (productId: string) => {
    if (!user) return;
    const current = user.wishlist || [];
    const exists = current.includes(productId);
    const updatedWishlist = exists ? current.filter((id) => id !== productId) : [...current, productId];
    updateProfile({ wishlist: updatedWishlist });
  };

  const isInWishlist = (productId: string) => {
    return Boolean(user?.wishlist?.includes(productId));
  };

  // Save Address
  const saveAddress = (addr: UserAddress) => {
    if (!user) return;
    const existing = user.addresses || [];
    let updated: UserAddress[];

    if (existing.some((a) => a.id === addr.id)) {
      updated = existing.map((a) => (a.id === addr.id ? addr : a));
    } else {
      updated = [...existing, addr];
    }

    // If marked default, unmark others
    if (addr.isDefault) {
      updated = updated.map((a) => (a.id === addr.id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
    }

    updateProfile({ addresses: updated });
  };

  const deleteAddress = (addressId: string) => {
    if (!user) return;
    const updated = (user.addresses || []).filter((a) => a.id !== addressId);
    updateProfile({ addresses: updated });
  };

  const loginAsDemoCustomer = () => {
    saveUserToStateAndStorage(DEFAULT_DEMO_CUSTOMER);
  };

  const loginAsDemoAdmin = (role: UserRole = 'admin') => {
    const demoAdmin: UserProfile = {
      id: `admin-${Date.now()}`,
      email: `${role}@manastraders.com`,
      fullName: role === 'admin' ? 'Store Owner / Admin' : 'Store Manager',
      phone: '9848500665',
      role,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      addresses: [],
      wishlist: [],
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    saveUserToStateAndStorage(demoAdmin);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        role: user?.role || 'customer',
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        updateProfile,
        changePassword,
        toggleWishlist,
        isInWishlist,
        saveAddress,
        deleteAddress,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
