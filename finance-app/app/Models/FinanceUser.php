<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class FinanceUser extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = ['name', 'email', 'password'];

    public function budgetPlans()
    {
        return $this->hasMany(BudgetPlan::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class);
    }
}