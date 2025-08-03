"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchCategory } from "@/services/CategoryService";
import { ICategoryDetail } from "@/interfaces/ICategoryDetail";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/utils/constants";

export default function CategoryDetailPage() {
    // Get category id from URL parameters
    const params = useParams();
    const categoryId = params.categoryId;

    // Fetch category data
    const [category, setCategory] = useState<ICategoryDetail>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getCategory = async () => {
            try {
                setLoading(true);
                const data = await fetchCategory(categoryId as string);
                setCategory(data);
            } catch (err) {
                setError('Failed to load category');
                console.error('Error fetching category:', err);
            } finally {
                setLoading(false);
            }
        };

        getCategory();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading category details...</p>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Category Not Found</h2>
                    <p className="text-gray-300 mb-6">{error || 'This category could not be found.'}</p>
                    <Link 
                        href="/categories"
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section */}
            <div className="relative h-64 md:h-60 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30">
                    {category.thumbnail && (
                        <Image
                            src={category.thumbnail}
                            alt={category.name}
                            fill
                            sizes="100vw"
                            className="object-cover opacity-50"
                            priority
                        />
                    )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
                
                {/* Content */}
                <div className="relative h-full flex items-end">
                    <div className="max-w-7xl mx-auto w-full p-6 pb-8">
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <Link 
                                href="/categories" 
                                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Categories
                            </Link>
                        </div>
                        
                        {/* Title and Description */}
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
                            {category.name}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                            {category.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Subcategories Section */}
                {category.subcategories && category.subcategories.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center mb-8">
                            <div className="text-3xl mr-4">🗂️</div>
                            <h2 className="font-display text-3xl font-bold text-white">
                                Subcategories
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {category.subcategories.map((subcategory) => (
                                <Link 
                                    key={subcategory.id} 
                                    href={`/categories/${subcategory.id}`}
                                    className="group"
                                >
                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                                        {/* Thumbnail */}
                                        <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 relative overflow-hidden">
                                            {subcategory.thumbnail ? (
                                                <Image 
                                                    src={subcategory.thumbnail} 
                                                    alt={subcategory.name}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="text-4xl text-white/70">📁</div>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                                {subcategory.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                                {subcategory.description}
                                            </p>
                                            
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
                    </section>
                )}

                {/* Soundtracks Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <div className="text-3xl mr-4">🎵</div>
                        <h2 className="font-display text-3xl font-bold text-white">
                            Soundtracks
                        </h2>
                    </div>
                    
                    {category.soundtracks && category.soundtracks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.soundtracks.map((soundtrack) => (
                                <div 
                                    key={soundtrack.id} 
                                    className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-amber-600/30 to-orange-600/30 relative overflow-hidden">
                                        {soundtrack.thumbnail ? (
                                            <Image 
                                                src={`${BASE_URL}${soundtrack.thumbnail}`} 
                                                alt={soundtrack.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl text-white/70">🎼</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                            <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-display text-xl font-semibold text-white mb-3">
                                            {soundtrack.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                            {soundtrack.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-black/10 rounded-xl border border-white/10">
                            <div className="text-gray-400 text-6xl mb-4">🎼</div>
                            <h3 className="text-2xl font-bold text-white mb-2">No Soundtracks Yet</h3>
                            <p className="text-gray-400">This category doesn&apos;t have any soundtracks yet.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};