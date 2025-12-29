export default function Loading() {
    return (
        <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white">
            {/* Header Skeleton */}
            <div className="h-16 border-b border-black dark:border-white animate-pulse" />

            {/* Product Detail Skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image Skeleton */}
                    <div className="aspect-square bg-gray-300 dark:bg-gray-700 animate-pulse" />

                    {/* Info Skeleton */}
                    <div className="space-y-6">
                        <div className="h-8 bg-gray-300 dark:bg-gray-700 w-24 animate-pulse" />
                        <div className="h-16 bg-gray-300 dark:bg-gray-700 w-full animate-pulse" />
                        <div className="h-24 bg-gray-300 dark:bg-gray-700 w-full animate-pulse" />
                        <div className="h-12 bg-gray-300 dark:bg-gray-700 w-48 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Related Products Skeleton */}
            <div className="max-w-7xl mx-auto px-6 py-20 border-t border-black dark:border-white">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 w-48 mb-10 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-square bg-gray-300 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
