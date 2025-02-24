<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Get recent transactions with relationships
        $recentTransactions = Transaction::with(['category', 'paymentMethod'])
            ->where('user_id', $user->id)
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
    
        // Calculate totals and percentages
        $currentMonth = Carbon::now()->startOfMonth();
        $transactions = Transaction::where('user_id', $user->id)
            ->whereMonth('transaction_date', $currentMonth->month)
            ->whereYear('transaction_date', $currentMonth->year)
            ->with('category')
            ->get();
    
        $totalIncome = $transactions->whereIn('category.type', ['income'])->sum('amount');
        $totalExpenses = $transactions->whereIn('category.type', ['expense'])->sum('amount');
        $totalBalance = $totalIncome - $totalExpenses;
    

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'totalBalance' => $totalBalance,
            'totalIncome' => $totalIncome,
            'totalExpenses' => $totalExpenses,
            'recentTransactions' => $recentTransactions
        ]);
    }
}