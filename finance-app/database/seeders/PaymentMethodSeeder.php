<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run()
    {
        $methods = [
            [
                'name' => 'Cash',
                'type' => 'cash',
                'details' => 'Cash payment',
                'user_id' => null
            ],
            [
                'name' => 'Credit Card',
                'type' => 'credit_card',
                'details' => 'Credit card payment',
                'user_id' => null
            ],
            [
                'name' => 'Debit Card',
                'type' => 'debit_card',
                'details' => 'Debit card payment',
                'user_id' => null
            ],
            [
                'name' => 'Bank Transfer',
                'type' => 'bank_transfer',
                'details' => 'Bank transfer payment',
                'user_id' => null
            ],
            [
                'name' => 'E-Wallet',
                'type' => 'e_wallet',
                'details' => 'Electronic wallet payment (e.g., PromptPay, TrueMoney)',
                'user_id' => null
            ],
            [
                'name' => 'Other',
                'type' => 'other',
                'details' => 'Other payment methods',
                'user_id' => null
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::create($method);
        }
    }
}