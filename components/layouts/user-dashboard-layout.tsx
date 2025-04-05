"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/auth-context';
import { HospitalIcon, Menu, Search, Brain, User, MessageSquare, Calendar, LogOut } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center flex-col">
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
                    href="/dashboard/user" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    <User className="h-4 w-4" />
                    Dashboard
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
                  <Link 
                    href="/dashboard/user/messages" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Link>
                  <Link 
                    href="/dashboard/user/appointments" 
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={closeMenu}
                  >
                    <Calendar className="h-4 w-4" />
                    Appointments
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
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <HospitalIcon className="h-6 w-6" />
              <span className="font-bold hidden md:inline-block">MediMatch</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard/user" className="text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/hospitals" className="text-sm font-medium">
                Find Hospitals
              </Link>
              <Link href="/recommendations" className="text-sm font-medium">
                Get Recommendations
              </Link>
              <Link href="/dashboard/user/messages" className="text-sm font-medium">
                Messages
              </Link>
              <Link href="/dashboard/user/appointments" className="text-sm font-medium">
                Appointments
              </Link>
            </nav>
            <ModeToggle />
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-sm font-medium">
                {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline-block">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-6">
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