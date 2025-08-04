"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchSubcategory } from "@/services/SubcategoryService";
import { createSubcategory } from "@/services/SubcategoryService";
import { createSoundtrack } from "@/services/SoundtrackService";
import { ISubcategory } from "@/interfaces/ISubcategory";
import { ICreateSubcategory } from "@/interfaces/ICreateSubcategory";
import { ICreateSoundtrack } from "@/interfaces/ICreateSoundtrack";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/utils/constants";

export default function SubcategoryPage() {
    // Get category id from URL parameters
    const params = useParams();
    const categoryId = params.categoryId;
    const subcategoryId = params.subcategoryId;

    // Fetch subcategory data based on categoryId and subcategoryId
    const [subcategory, setSubcategory] = useState<ISubcategory | null>();
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

    // Subcategory creation handlers
    const handleCreateSubcategory = async (formData: FormData) => {
        try {
            setCreating(true);
            setCreateError(null);
            
            const data: ICreateSubcategory = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                category: categoryId as string,
                subcategory: subcategoryId as string,
                thumbnail: formData.get('thumbnail') as File || undefined
            };

            await createSubcategory(data);
            setShowCreateModal(false);
            // Refetch subcategory data
            const updatedData = await fetchSubcategory(subcategoryId as string);
            setSubcategory(updatedData);
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create subcategory');
            console.error('Error creating subcategory:', err);
        } finally {
            setCreating(false);
        }
    };

    // Soundtrack creation handlers
    const handleCreateSoundtrack = async (formData: FormData) => {
        try {
            setCreatingSoundtrack(true);
            setCreateSoundtrackError(null);
            
            const data: ICreateSoundtrack = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: categoryId as string,
                subcategory: subcategoryId as string,
                thumbnail: formData.get('thumbnail') as File || undefined,
                url: formData.get('url') as string
            };

            await createSoundtrack(data);
            setShowCreateSoundtrackModal(false);
            // Refetch subcategory data
            const updatedData = await fetchSubcategory(subcategoryId as string);
            setSubcategory(updatedData);
        } catch (err) {
            setCreateSoundtrackError(err instanceof Error ? err.message : 'Failed to create soundtrack');
            console.error('Error creating soundtrack:', err);
        } finally {
            setCreatingSoundtrack(false);
        }
    };

    useEffect(() => {
        const getSubcategory = async () => {
            try {
                setLoading(true);
                const data = await fetchSubcategory(subcategoryId as string);
                setSubcategory(data);
            } catch (err) {
                setError('Failed to load subcategory');
                console.error('Error fetching subcategory:', err);
            } finally {
                setLoading(false);
            }
        };

        getSubcategory();
    }, [subcategoryId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading subcategory details...</p>
                </div>
            </div>
        );
    }

    if (error || !subcategory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-400 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Subcategory Not Found</h2>
                    <p className="text-gray-300 mb-6">{error || 'This subcategory could not be found.'}</p>
                    <Link 
                        href={`/categories/${categoryId}`}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Category
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
                    {subcategory.thumbnail && (
                        <Image
                            src={`${BASE_URL}${subcategory.thumbnail}`}
                            alt={subcategory.name}
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
                            <div className="flex items-center space-x-2 text-sm">
                                <Link 
                                    href="/categories" 
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Categories
                                </Link>
                                <span className="text-gray-500">/</span>
                                <Link 
                                    href={`/categories/${categoryId}`}
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    {subcategory.category_name}
                                </Link>
                                <span className="text-gray-500">/</span>
                                {subcategory.subcategory && (
                                    <Link
                                        href={`/categories/${categoryId}/${subcategory.subcategory}`}
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        {subcategory.parent_name}
                                    </Link>
                                )}
                                {subcategory.subcategory && (
                                    <span className="text-gray-500">/</span>
                                )}
                                <span className="text-gray-300">{subcategory.name}</span>
                            </div>
                        </div>
                        
                        {/* Title and Description */}
                        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
                            {subcategory.parent_name ? `${subcategory.category_name} / ${subcategory.parent_name} / ${subcategory.name}` : `${subcategory.category_name} / ${subcategory.name}`}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
                            {subcategory.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Nested Subcategories Section */}
                <section className="mb-16">
                    <div className="flex items-center mb-8">
                        <div className="text-3xl mr-4">📂</div>
                        <h2 className="font-display text-3xl font-bold text-white">
                            Subcategories
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {subcategory.subcategories && subcategory.subcategories.map((nestedSubcategory) => (
                            <Link 
                                key={nestedSubcategory.id} 
                                href={`/categories/${categoryId}/${nestedSubcategory.id}`}
                                className="group"
                            >
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 h-full flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 relative overflow-hidden">
                                        {nestedSubcategory.thumbnail ? (
                                            <Image 
                                                src={`${BASE_URL}${nestedSubcategory.thumbnail}`} 
                                                alt={nestedSubcategory.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl text-white/70">�</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                            {nestedSubcategory.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                                            {nestedSubcategory.description}
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
                        
                        {/* Create Subcategory Card */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="group cursor-pointer"
                        >
                            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 border-dashed hover:border-amber-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 h-full flex flex-col">
                                {/* Plus Icon Area */}
                                <div className="aspect-video bg-gradient-to-br from-amber-600/20 to-orange-600/20 relative overflow-hidden flex items-center justify-center rounded-t-xl">
                                    <div className="text-6xl text-amber-400/70 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300">
                                        +
                                    </div>
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-xl"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors">
                                        Create Subcategory
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                        Add a new subcategory to organize your soundtracks in more detail.
                                    </p>
                                    
                                    {/* Create Arrow */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                        <span className="text-sm text-amber-400 font-medium">Create</span>
                                        <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </button>
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
                        {subcategory.soundtracks && subcategory.soundtracks.map((soundtrack) => (
                            <a
                                key={soundtrack.id}
                                href={soundtrack.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group cursor-pointer"
                            >
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 h-full flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-amber-600/30 to-orange-600/30 relative overflow-hidden">
                                        {soundtrack.thumbnail ? (
                                            <Image 
                                                src={`${BASE_URL}${soundtrack.thumbnail}`} 
                                                alt={soundtrack.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-4xl text-white/70">🎼</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-colors">
                                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                            {soundtrack.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                                            {soundtrack.description}
                                        </p>
                                        
                                        {/* External Link Indicator */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                            <span className="text-sm text-amber-400 font-medium">Listen</span>
                                            <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                        
                        {/* Create Soundtrack Card */}
                        <button
                            onClick={() => setShowCreateSoundtrackModal(true)}
                            className="group cursor-pointer"
                        >
                            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 border-dashed hover:border-amber-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 h-full flex flex-col">
                                {/* Plus Icon Area */}
                                <div className="aspect-video bg-gradient-to-br from-amber-600/20 to-orange-600/20 relative overflow-hidden flex items-center justify-center rounded-t-xl">
                                    <div className="text-6xl text-amber-400/70 group-hover:text-amber-400 group-hover:scale-110 transition-all duration-300">
                                        +
                                    </div>
                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-xl"></div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors">
                                        Create Soundtrack
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed flex-1">
                                        Add a new soundtrack to enhance your D&D sessions with perfect atmospheric music.
                                    </p>
                                    
                                    {/* Create Arrow */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                        <span className="text-sm text-amber-400 font-medium">Create</span>
                                        <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>
            </div>

            {/* Create Subcategory Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full p-6 shadow-2xl">
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-white/20 max-w-md w-full p-6 shadow-2xl">
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
                                    required
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
                                    required
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