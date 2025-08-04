import Image from 'next/image';
import { useState } from 'react';
import { ISoundtrack } from '@/interfaces/ISoundtrack';
import { deleteSoundtrack, updateSoundtrack } from '@/services/SoundtrackService';

interface SoundtrackCardProps {
    soundtrack: ISoundtrack;
    baseUrl?: string;
    categoryId?: string;
    subcategoryId?: string;
    onDelete?: () => void;
    onUpdate?: () => void;
}

export default function SoundtrackCard({ 
    soundtrack, 
    baseUrl = '', 
    categoryId, 
    subcategoryId, 
    onDelete, 
    onUpdate 
}: SoundtrackCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: soundtrack.title,
        description: soundtrack.description,
        url: soundtrack.url,
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
            title: soundtrack.title,
            description: soundtrack.description,
            url: soundtrack.url,
            thumbnail: null
        });
    };

    const handleUpdateSoundtrack = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            setIsUpdating(true);
            
            await updateSoundtrack(soundtrack.id.toString(), {
                title: editFormData.title,
                description: editFormData.description,
                url: editFormData.url,
                category: categoryId || '',
                subcategory: subcategoryId,
                thumbnail: editFormData.thumbnail || undefined
            });
            
            // Update the soundtrack in parent component
            if (onUpdate) {
                onUpdate();
            }
            
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating soundtrack:', error);
            alert(error instanceof Error ? error.message : 'Failed to update soundtrack');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteSoundtrack(soundtrack.id.toString());
            if (onDelete) {
                onDelete();
            }
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting soundtrack:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete soundtrack');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handlePlaySoundtrack = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Open the soundtrack URL in a new tab
        if (soundtrack.url) {
            window.open(soundtrack.url, '_blank');
        }
    };

    return (
        <>
            {isEditing ? (
                // Edit Form Mode
                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-amber-400/50 overflow-hidden h-full flex flex-col relative">
                    <form onSubmit={handleUpdateSoundtrack} className="h-full flex flex-col">
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-green-600/30 to-emerald-600/30 relative overflow-hidden">
                            {soundtrack.thumbnail ? (
                                <Image 
                                    src={`${baseUrl}${soundtrack.thumbnail}`} 
                                    alt={soundtrack.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-4xl text-white/70">🎵</div>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        
                        {/* Edit Form Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            {/* Title Input */}
                            <input
                                type="text"
                                value={editFormData.title}
                                onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                className="font-display text-xl font-semibold text-white mb-3 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                placeholder="Soundtrack title"
                                required
                            />
                            
                            {/* URL Input */}
                            <input
                                type="url"
                                value={editFormData.url}
                                onChange={(e) => setEditFormData({...editFormData, url: e.target.value})}
                                className="text-white mb-3 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all"
                                placeholder="Soundtrack URL"
                                required
                            />
                            
                            {/* Description Textarea */}
                            <textarea
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                className="text-gray-300 text-sm leading-relaxed flex-1 bg-slate-700/50 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/25 transition-all resize-none"
                                placeholder="Soundtrack description"
                                rows={2}
                                required
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
                <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-green-400/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 h-full flex flex-col relative group">
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        {/* Edit Button */}
                        <button
                            onClick={handleEditClick}
                            className="bg-amber-600/80 hover:bg-amber-600 backdrop-blur-sm rounded-lg p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
                            title="Edit soundtrack"
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
                            title="Delete soundtrack"
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
                    <div className="aspect-video bg-gradient-to-br from-green-600/30 to-emerald-600/30 relative overflow-hidden">
                        {soundtrack.thumbnail ? (
                            <Image 
                                src={`${baseUrl}${soundtrack.thumbnail}`} 
                                alt={soundtrack.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="text-4xl text-white/70">🎵</div>
                            </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Play Button Overlay */}
                        <button
                            onClick={handlePlaySoundtrack}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30"
                            title="Play soundtrack"
                        >
                            <div className="bg-green-600/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </button>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">
                            {soundtrack.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                            {soundtrack.description}
                        </p>
                        
                        {/* Play Button */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <button
                                onClick={handlePlaySoundtrack}
                                className="flex items-center gap-2 text-sm text-green-400 font-medium hover:text-green-300 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                                Play Track
                            </button>
                            <svg className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteModal && (
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
                                <h2 className="font-display text-2xl font-bold text-white mb-1">Delete Soundtrack</h2>
                                <p className="text-red-400 text-sm">This action cannot be undone</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-300 mb-4">
                                Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{soundtrack.title}&rdquo;</span>?
                            </p>
                            
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-200 text-sm">
                                    This soundtrack will be permanently removed from your collection.
                                </p>
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
