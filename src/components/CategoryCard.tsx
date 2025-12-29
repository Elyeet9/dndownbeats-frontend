import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ICategory } from '@/interfaces/ICategory';
import { deleteCategoryCounts, deleteCategory, updateCategory } from '@/services/CategoryService';

interface CategoryCardProps {
    category: ICategory;
    baseUrl?: string;
    onDelete?: () => void;
    onUpdate?: () => void;
}

export default function CategoryCard({ category, baseUrl = '', onDelete, onUpdate }: CategoryCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCounts, setDeleteCounts] = useState<{subcategories_count: number, soundtracks_count: number} | null>(null);
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: category.name,
        description: category.description,
        thumbnail: null as File | null
    });

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData({
            name: category.name,
            description: category.description,
            thumbnail: null
        });
    };

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            setIsUpdating(true);
            
            await updateCategory(category.id.toString(), {
                name: editFormData.name,
                description: editFormData.description,
                thumbnail: editFormData.thumbnail || undefined
            });
            
            // Update the category in parent component
            if (onUpdate) {
                onUpdate();
            }
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating category:', error);
            alert(error instanceof Error ? error.message : 'Failed to update category');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation(); // Prevent event bubbling
        
        if (isDeleting) return;
        
        try {
            setIsDeleting(true);
            
            // Get counts first
            const counts = await deleteCategoryCounts(category.id.toString());
            setDeleteCounts(counts);
            setShowDeleteModal(true);
        } catch (error) {
            console.error('Error getting delete counts:', error);
            alert(error instanceof Error ? error.message : 'Failed to get category information');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteCategory(category.id.toString());
            if (onDelete) {
                onDelete();
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete category');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteCounts(null);
    };

    return (
        <>
            {isEditing ? (
                // Edit Form Mode
                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/50 overflow-hidden h-full flex flex-col relative">
                    <form onSubmit={handleUpdateCategory} className="h-full flex flex-col">
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 relative overflow-hidden">
                            {category.thumbnail ? (
                                <Image 
                                    src={`${baseUrl}${category.thumbnail}`} 
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-4xl text-white/70">🎭</div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        
                        {/* Edit Form Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            {/* Name Input */}
                            <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                className="font-display text-xl font-semibold text-white mb-3 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                placeholder="Category name"
                                required
                            />
                            
                            {/* Description Textarea */}
                            <textarea
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                className="text-gray-300 text-sm leading-relaxed flex-1 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all resize-none"
                                placeholder="Category description"
                                rows={3}
                            />
                            
                            {/* Thumbnail Input */}
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Update Thumbnail (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditFormData({...editFormData, thumbnail: e.target.files?.[0] || null})}
                                    className="w-full text-sm text-gray-300 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-gradient-to-r file:from-amber-600 file:to-orange-600 file:text-white hover:file:from-amber-700 hover:file:to-orange-700 transition-all"
                                />
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="flex-1 px-4 py-2 bg-slate-600/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700/50 border border-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25"
                                >
                                    {isUpdating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                // Normal Card View Mode
                <Link 
                    href={`/categories/${category.id}`}
                    className="group"
                >
                    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 h-full flex flex-col relative">
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {/* Edit Button */}
                            <button
                                onClick={handleEditClick}
                                className="bg-amber-600/80 hover:bg-amber-600 backdrop-blur-sm rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
                                title="Edit category"
                            >
                                <svg className="w-4 h-4 text-white transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            
                            {/* Delete Button */}
                            <button
                                onClick={handleDeleteClick}
                                disabled={isDeleting}
                                className="bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg hover:shadow-red-500/30 active:scale-95"
                                title="Delete category"
                            >
                                {isDeleting ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                ) : (
                                    <svg className="w-4 h-4 text-white transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-purple-600/30 to-pink-600/30 relative overflow-hidden">
                            {category.thumbnail ? (
                                <Image 
                                    src={`${baseUrl}${category.thumbnail}`} 
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
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-display text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
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
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && deleteCounts && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={handleCancelDelete}
            >
                <div 
                    className="bg-gradient-to-br from-slate-900/95 via-red-900/95 to-slate-900/95 backdrop-blur-md rounded-xl border border-red-500/30 max-w-md w-full p-6 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center mb-6">
                        <div className="bg-red-500/20 rounded-full p-3 mr-4">
                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-white mb-1">Delete Category</h2>
                            <p className="text-red-400 text-sm">This action cannot be undone</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-300 mb-4">
                            Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{category.name}&rdquo;</span>?
                        </p>
                        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <p className="text-red-200 text-sm font-medium mb-2">This will permanently delete:</p>
                            <ul className="text-red-200 text-sm space-y-1">
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    {deleteCounts.subcategories_count} subcategories
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                    {deleteCounts.soundtracks_count} soundtracks
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleCancelDelete}
                            className="flex-1 px-4 py-2 bg-slate-600/50 backdrop-blur-sm text-white rounded-lg hover:bg-slate-700/50 border border-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Forever
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}