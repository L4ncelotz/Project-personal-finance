<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Transaction;
use App\Policies\TransactionPolicy;
use App\Models\Category;
use App\Policies\CategoryPolicy;
use App\Models\PaymentMethod;
use App\Policies\PaymentMethodPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Transaction::class => TransactionPolicy::class,
        Category::class => CategoryPolicy::class,
        PaymentMethod::class => PaymentMethodPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
