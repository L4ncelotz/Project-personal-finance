import { Head, Link } from '@inertiajs/react';
import { ArrowRight, PiggyBank, CreditCard, ChartBar } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div className="relative min-h-screen bg-gradient-to-br from-emerald-500 to-emerald-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <img 
                                className="h-8 w-auto" 
                                src="https://placehold.co/200x50?text=Finance+App" 
                                alt="Finance App" 
                            />
                        </div>
                        <div className="space-x-4">
                            <Link 
                                href={route('login')} 
                                className="text-white hover:text-emerald-100"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50"
                            >
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Hero Section */}
                    <div className="mt-24 text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                            Take Control of Your Finances
                        </h1>
                        <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
                            Track expenses, manage budgets, and achieve your financial goals with our comprehensive finance management app.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center px-8 py-3 bg-white text-emerald-600 rounded-lg text-lg font-medium hover:bg-emerald-50"
                        >
                            Start Your Journey
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>

                    {/* Features Section */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
                            <PiggyBank className="h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Smart Budgeting</h3>
                            <p className="text-emerald-100">Create and manage budgets that help you save money and reach your financial goals.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
                            <CreditCard className="h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                            <p className="text-emerald-100">Easily track your expenses and categorize your spending habits.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
                            <ChartBar className="h-12 w-12 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Financial Insights</h3>
                            <p className="text-emerald-100">Get detailed insights and analytics about your spending patterns.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
