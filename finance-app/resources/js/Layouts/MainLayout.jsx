import { ToastProvider, ToastViewport } from '@/Components/ui/toast';
import MainNav from '@/Components/Navigation/MainNav';

export default function MainLayout({ user, header, children }) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50">
                <MainNav user={user} />

                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main>
                    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                <footer className="bg-white border-t border-gray-200">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-500">
                            © {new Date().getFullYear()} Your Finance App. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
            <ToastViewport />
        </ToastProvider>
    );
}