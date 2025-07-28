"use client";
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../_stores/store';
import authService from '../_services/auth.service';
import { getAuthToken } from '../_utils/common.util';

const publicRoutes = ['/login', '/register', '/forgot-password'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token  = useSelector((state: RootState) => state.auth.token);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const  checkAuth = async () => {
      const isPublic = publicRoutes.some(route => pathname.startsWith(route));
      if (!token && !isPublic) {
        if(token == null &&  getAuthToken()){
          try {
            const tokenExp = await authService.checkToken();
            if(tokenExp.data){
              setIsAuthorized(true);
              return;
            }
          } catch (error) {
             router.replace('/login');
             setIsAuthorized(false);
          }
          
          
        }
          router.replace('/login');
          setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
    const handleRouteChange = () => checkAuth();
    window.addEventListener('routeChangeComplete', handleRouteChange);
    return () => {
      window.removeEventListener('routeChangeComplete', handleRouteChange);
    };
  }, [token, pathname, router]);

  if (isAuthorized === null) {
    return <div></div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}