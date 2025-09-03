export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string;
  createdAt: string;
  isActive: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string;
  category: 'data' | 'system';
}

export interface Organization {
  id: string;
  name: string;
  website: string;
  address: string;
  phone: string;
  email: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  allowUserRegistration: boolean;
  requireEmailVerification: boolean;
  sessionTimeout: number;
}

export interface AdminSetup {
  admin: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  organization: {
    name: string;
    website: string;
    address: string;
    phone: string;
    email: string;
  };
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface SignupData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    isGoogleAuth?: boolean;
  };
  organization: {
    name: string;
    website: string;
    address: string;
    phone: string;
    email: string;
  };
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMode: 'login' | 'signup' | 'setup' | 'authenticated';
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleUser: GoogleUser) => Promise<void>;
  signup: (signupData: SignupData) => Promise<void>;
  logout: () => void;
  setAuthMode: (mode: 'login' | 'signup' | 'setup' | 'authenticated') => void;
  completeSetup: (setupData: AdminSetup) => Promise<void>;
}