<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'category_id',
        'sub_category_id',
        'amount',
        'period_type',
        'start_date',
        'end_date',
        'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'amount' => 'decimal:2'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function getActualSpentAttribute()
    {
        $query = Transaction::where('category_id', $this->category_id)
            ->when($this->sub_category_id, function ($query) {
                $query->where('sub_category_id', $this->sub_category_id);
            })
            ->whereBetween('transaction_date', [$this->start_date, $this->end_date ?? now()]);

        return $query->sum('amount');
    }

    public function getRemainingBudgetAttribute()
    {
        return $this->amount - $this->actual_spent;
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->amount <= 0) return 0;
        return min(100, ($this->actual_spent / $this->amount) * 100);
    }
}
