"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCategories, createCategory } from "@/services/CategoryService";
import { ICategory } from "@/interfaces/ICategory";
import { ICreateCategory } from "@/interfaces/ICreateCategory";
import { BASE_URL } from "@/utils/constants";
import CategoryCard from "@/components/CategoryCard";
import CreateCategoryCard from "@/components/CreateCategoryCard";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const getCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleCreateCategory = async (formData: FormData) => {
        try {
            setCreating(true);
            setCreateError(null);
            
            const categoryData: ICreateCategory = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                thumbnail: formData.get('thumbnail') as File || undefined
            };

            await createCategory(categoryData);
            await getCategories();
            setShowCreateModal(false);
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create category');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteCategory = async () => {
        // Remove the deleted category from the state
        getCategories();
    };

    const handleUpdateCategory = () => {
        // Update the category in the state
        getCategories();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading your categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link 
                            href="/" 
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        
                        <h1 className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent pb-2 mb-4">
                            Categories
                        </h1>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard 
                                key={category.id}
                                category={category}
                                baseUrl={BASE_URL}
                                onDelete={handleDeleteCategory}
                                onUpdate={handleUpdateCategory}
                            />
                        ))}
                        
                        {/* Create Category Card */}
                        <CreateCategoryCard onClick={() => setShowCreateModal(true)} />
                    </div>
                </div>
            </div>

            {/* Create Category Modal */}
            {showCreateModal && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setShowCreateModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Create New Category</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleCreateCategory(formData);
                            }}
                            className="space-y-4"
                        >
                            {createError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-red-400 text-sm">{createError}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all resize-none"
                                    placeholder="Describe this category"
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-2">
                                    Thumbnail Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="thumbnail"
                                    name="thumbnail"
                                    accept="image/*"
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gradient-to-r file:from-amber-600 file:to-orange-600 file:text-white file:text-sm hover:file:from-amber-700 hover:file:to-orange-700 transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-600/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700/50 border border-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25"
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}