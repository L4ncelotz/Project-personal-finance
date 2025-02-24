<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get transactions for the current month
        $currentMonth = Carbon::now()->startOfMonth();
        
        // Calculate total income and expenses for current month
        $transactions = Transaction::where('user_id', $user->id)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->whereYear('transaction_date', $currentMonth->year)
            ->with('category')
            ->get();

        $totalIncome = $transactions->whereIn('category.type', ['income'])
            ->sum('amount');
            
        $totalExpenses = $transactions->whereIn('category.type', ['expense'])
            ->sum('amount');

        // Calculate total balance
        $totalBalance = $totalIncome - $totalExpenses;


        // Get recent transactions
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->with('category')
            ->orderBy('transaction_date', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'totalBalance' => $totalBalance,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'recentTransactions' => $recentTransactions
        ]);
    }
}