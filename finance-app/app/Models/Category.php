<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'type'];

    public function user()
    {
        return $this->belongsTo(FinanceUser::class);
    }

    public function budgetPlans()
    {
        return $this->hasMany(BudgetPlan::class);
    }

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
