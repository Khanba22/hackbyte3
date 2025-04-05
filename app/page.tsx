"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HospitalIcon, MessageSquare, Search, Brain } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter()
  const {isAuthenticated} = useAuth()

  useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== '/') {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HospitalIcon className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">MediMatch</h1>
          </div>
          <div className="flex space-x-2">
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find the Perfect Hospital for Your Healthcare Needs</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
            Our AI-powered recommendation system helps you find the best hospitals based on your specific requirements, location, and medical needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/hospitals">
              <Button size="lg" className="px-8">
                Find Hospitals
              </Button>
            </Link>
            <Link href="/recommendations">
              <Button size="lg" variant="outline" className="px-8">
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mb-4">
                <Search className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Hospital Search</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Filter hospitals by specialization, location, ratings, and availability to find the perfect match.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
                <Brain className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get personalized hospital recommendations based on your specific medical needs and preferences.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with doctors and hospitals directly through our integrated WhatsApp messaging system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Ideal Hospital?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have found the perfect healthcare provider through our platform.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="px-8">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <HospitalIcon className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">MediMatch</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Connecting patients with the best healthcare providers through AI-powered recommendations.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><Link href="/hospitals" className="text-gray-600 dark:text-gray-400 hover:text-primary">Hospitals</Link></li>
                  <li><Link href="/recommendations" className="text-gray-600 dark:text-gray-400 hover:text-primary">Recommendations</Link></li>
                  <li><Link href="/doctors" className="text-gray-600 dark:text-gray-400 hover:text-primary">Doctors</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">Contact</Link></li>
                  <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary">Careers</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© {new Date().getFullYear()} MediMatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}