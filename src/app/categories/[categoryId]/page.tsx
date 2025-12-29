"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchCategory } from "@/services/CategoryService";
import { createSubcategory } from "@/services/SubcategoryService";
import { createSoundtrack } from "@/services/SoundtrackService";
import { ICategoryDetail } from "@/interfaces/ICategoryDetail";
import { ICreateSubcategory } from "@/interfaces/ICreateSubcategory";
import { ICreateSoundtrack } from "@/interfaces/ICreateSoundtrack";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/utils/constants";
import SubcategoryCard from "@/components/SubcategoryCard";
import SoundtrackCard from "@/components/SoundtrackCard";
import CreateSubcategoryCard from "@/components/CreateSubcategoryCard";
import CreateSoundtrackCard from "@/components/CreateSoundtrackCard";

export default function CategoryDetailPage() {
    // Get category id from URL parameters
    const params = useParams();
    const categoryId = params.categoryId;

    // Fetch category data
    const [category, setCategory] = useState<ICategoryDetail>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Subcategory creation state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    
    // Soundtrack creation state
    const [showCreateSoundtrackModal, setShowCreateSoundtrackModal] = useState(false);
    const [creatingSoundtrack, setCreatingSoundtrack] = useState(false);
    const [createSoundtrackError, setCreateSoundtrackError] = useState<string | null>(null);

    const getCategory = async (id: string) => {
        try {
            setLoading(true);
            const data = await fetchCategory(id as string);
            setCategory(data);
        } catch (err) {
            setError('Failed to load category');
            console.error('Error fetching category:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategory(categoryId as string);
    }, [categoryId]);

    const handleCreateSubcategory = async (formData: FormData) => {
        try {
            setCreating(true);
            setCreateError(null);
            
            const subcategoryData: ICreateSubcategory = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: categoryId as string,
                thumbnail: formData.get('thumbnail') as File || undefined
            };

            await createSubcategory(subcategoryData);
            
            // Refetch the categories to include the new subcategory
            await getCategory(categoryId as string);
            
            setShowCreateModal(false);
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create subcategory');
        } finally {
            setCreating(false);
        }
    };

    const handleCreateSoundtrack = async (formData: FormData) => {
        try {
            setCreatingSoundtrack(true);
            setCreateSoundtrackError(null);
            
            const soundtrackData: ICreateSoundtrack = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: categoryId as string,
                url: formData.get('url') as string,
                thumbnail: formData.get('thumbnail') as File || undefined
            };

            await createSoundtrack(soundtrackData);
            
            // Refetch the category to include the new soundtrack
            await getCategory(categoryId as string);
            
            setShowCreateSoundtrackModal(false);
        } catch (err) {
            setCreateSoundtrackError(err instanceof Error ? err.message : 'Failed to create soundtrack');
        } finally {
            setCreatingSoundtrack(false);
        }
    };

    const handleDeleteSubcategory = () => {
        getCategory(categoryId as string);
    };

    const handleUpdateSubcategory = () => {
        getCategory(categoryId as string);
    };

    const handleDeleteSoundtrack = () => {
        getCategory(categoryId as string);
    };

    const handleUpdateSoundtrack = () => {
        getCategory(categoryId as string);
    };    
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
                            src={`${BASE_URL}${category.thumbnail}`}
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
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <div className="text-3xl mr-4">🗂️</div>
                        <h2 className="font-display text-3xl font-bold text-white">
                            Subcategories
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {category.subcategories && category.subcategories.map((subcategory) => (
                            <SubcategoryCard
                                key={subcategory.id}
                                subcategory={subcategory}
                                baseUrl={BASE_URL}
                                categoryId={categoryId as string}
                                onDelete={handleDeleteSubcategory}
                                onUpdate={handleUpdateSubcategory}
                            />
                        ))}
                        
                        {/* Create Subcategory Card */}
                        <CreateSubcategoryCard onClick={() => setShowCreateModal(true)} />
                    </div>
                </section>

                {/* Soundtracks Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <div className="text-3xl mr-4">🎵</div>
                        <h2 className="font-display text-3xl font-bold text-white">
                            Soundtracks
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.soundtracks && category.soundtracks.map((soundtrack) => (
                            <SoundtrackCard
                                key={soundtrack.id}
                                soundtrack={soundtrack}
                                baseUrl={BASE_URL}
                                categoryId={categoryId as string}
                                onDelete={handleDeleteSoundtrack}
                                onUpdate={handleUpdateSoundtrack}
                            />
                        ))}
                        
                        {/* Create Soundtrack Card */}
                        <CreateSoundtrackCard onClick={() => setShowCreateSoundtrackModal(true)} />
                    </div>
                </section>
            </div>

            {/* Create Subcategory Modal */}
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
                            <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Create New Subcategory</h2>
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
                                handleCreateSubcategory(formData);
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
                                    Subcategory Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                    placeholder="Enter subcategory name"
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
                                    placeholder="Describe this subcategory"
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
                                        'Create Subcategory'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Soundtrack Modal */}
            {showCreateSoundtrackModal && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={() => setShowCreateSoundtrackModal(false)}
                >
                    <div 
                        className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Create New Soundtrack</h2>
                            <button
                                onClick={() => setShowCreateSoundtrackModal(false)}
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
                                handleCreateSoundtrack(formData);
                            }}
                            className="space-y-4"
                        >
                            {createSoundtrackError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-red-400 text-sm">{createSoundtrackError}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Soundtrack Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                    placeholder="Enter soundtrack title"
                                />
                            </div>

                            <div>
                                <label htmlFor="soundtrackDescription" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="soundtrackDescription"
                                    name="description"
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all resize-none"
                                    placeholder="Describe this soundtrack"
                                ></textarea>
                            </div>

                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                                    Soundtrack URL
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    required
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                    placeholder="https://example.com/soundtrack"
                                />
                            </div>

                            <div>
                                <label htmlFor="soundtrackThumbnail" className="block text-sm font-medium text-gray-300 mb-2">
                                    Thumbnail Image (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="soundtrackThumbnail"
                                    name="thumbnail"
                                    accept="image/*"
                                    className="w-full px-3 py-2 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gradient-to-r file:from-amber-600 file:to-orange-600 file:text-white file:text-sm hover:file:from-amber-700 hover:file:to-orange-700 transition-all"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateSoundtrackModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-600/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700/50 border border-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingSoundtrack}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25"
                                >
                                    {creatingSoundtrack ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Soundtrack'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};