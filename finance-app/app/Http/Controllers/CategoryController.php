<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::with('subCategories')
                ->where('user_id', auth()->id())
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        $validated['user_id'] = auth()->id();

        Category::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense',
        ]);

        $category->update($validated);

        return redirect()->back();
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Check if category has transactions
        if ($category->transactions()->exists()) {
            return redirect()->back()->with('error', 'Cannot delete category that has transactions.');
        }

        // Delete associated subcategories first
        $category->subCategories()->delete();
        
        // Delete the category
        $category->delete();

        return redirect()->back()->with('message', 'Category deleted successfully.');
    }
}
