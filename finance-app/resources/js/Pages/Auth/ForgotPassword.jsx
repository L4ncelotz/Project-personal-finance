import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Link } from '@inertiajs/react';
import { KeyRound } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
            <Head title="Reset Password" />

            {/* Logo Section */}
            <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <KeyRound className="w-8 h-8 text-white" />
                </div>
            </div>

            <div className="w-full max-w-md">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-3 pb-6">
                        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                            Reset Password
                        </CardTitle>
                        <p className="text-sm text-center text-gray-500">
                            Enter your email and choose a new password
                        </p>
                    </CardHeader>

                    <CardContent>
                        {status && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                <p className="text-sm text-emerald-600 text-center font-medium">
                                    {status}
                                </p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    placeholder="name@example.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-gray-700">
                                    Confirm New Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    className="h-12 px-4 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                                >
                                    Back to login
                                </Link>
                                <Button
                                    type="submit"
                                    className="px-8 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 hover:shadow-emerald-300"
                                    disabled={processing}
                                >
                                    Reset Password
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}