interface CreateSoundtrackCardProps {
    onClick: () => void;
}

export default function CreateSoundtrackCard({ onClick }: CreateSoundtrackCardProps) {
    return (
        <button
            onClick={onClick}
            className="bg-black/20 backdrop-blur-sm rounded-xl border border-dashed border-green-400/50 hover:border-green-400 overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 h-full flex flex-col items-center justify-center p-6 group cursor-pointer"
        >
            {/* Plus Icon */}
            <div className="bg-green-600/20 rounded-full p-4 mb-4 group-hover:bg-green-600/30 transition-colors">
                <svg className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </div>
            
            {/* Text */}
            <h3 className="font-display text-xl font-semibold text-green-400 group-hover:text-green-300 transition-colors mb-2">
                Add Soundtrack
            </h3>
            <p className="text-gray-500 text-sm text-center">
                Add a new soundtrack to your collection
            </p>
        </button>
    );
}
