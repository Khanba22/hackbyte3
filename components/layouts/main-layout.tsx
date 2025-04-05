"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { HospitalIcon, Menu, Search, Brain, User, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex items-center gap-2 py-4">
                  <HospitalIcon className="h-5 w-5" />
                  <span className="font-bold">MediMatch</span>
                </div>
                <nav className="flex flex-col gap-4 py-4">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/hospitals" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    <Search className="h-4 w-4" />
                    Find Hospitals
                  </Link>
                  <Link 
                    href="/recommendations" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    <Brain className="h-4 w-4" />
                    Get Recommendations
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link 
                        href={user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/user'} 
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={closeMenu}
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }} 
                        className="flex items-center gap-2 text-lg font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/auth/login" 
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/auth/register" 
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={closeMenu}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <HospitalIcon className="h-6 w-6" />
              <span className="font-bold hidden md:inline-block">MediMatch</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/hospitals" className="text-sm font-medium">
                Find Hospitals
              </Link>
              <Link href="/recommendations" className="text-sm font-medium">
                Get Recommendations
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href={user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/user'}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} MediMatch. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}