"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/CategoryService";
import { ICategory } from "@/interfaces/ICategory";
import { BASE_URL } from "@/utils/constants";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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

        getCategories();
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
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
                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🎵</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Categories Yet</h3>
                        <p className="text-gray-400">Start by creating your first category to organize your soundtracks.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link 
                                key={category.id} 
                                href={`/categories/${category.id}`}
                                className="group"
                            >
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 relative overflow-hidden">
                                        {category.thumbnail ? (
                                            <Image 
                                                src={`${BASE_URL}${category.thumbnail}`} 
                                                alt={category.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl text-white/70">🎭</div>
                                            </div>
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                            {category.description}
                                        </p>
                                        
                                        {/* Explore Arrow */}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                            <span className="text-sm text-purple-400 font-medium">Explore</span>
                                            <svg className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}