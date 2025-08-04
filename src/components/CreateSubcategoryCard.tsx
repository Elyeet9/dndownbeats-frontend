interface CreateSubcategoryCardProps {
    onClick: () => void;
}

export default function CreateSubcategoryCard({ onClick }: CreateSubcategoryCardProps) {
    return (
        <button
            onClick={onClick}
            className="bg-black/20 backdrop-blur-sm rounded-xl border border-dashed border-purple-400/50 hover:border-purple-400 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 h-full flex flex-col items-center justify-center p-6 group"
        >
            {/* Plus Icon */}
            <div className="bg-purple-600/20 rounded-full p-4 mb-4 group-hover:bg-purple-600/30 transition-colors">
                <svg className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            
            {/* Text */}
            <h3 className="font-display text-xl font-semibold text-purple-400 group-hover:text-purple-300 transition-colors mb-2">
                Create Subcategory
            </h3>
            <p className="text-gray-500 text-sm text-center">
                Add a new subcategory to organize your content
            </p>
        </button>
    );
}
