import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthForm } from './AuthForm';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}