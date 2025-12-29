export default function Loading() {
    return (
        <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white">
            {/* Header Skeleton */}
            <div className="h-16 border-b border-black dark:border-white flex items-center justify-between px-6 animate-pulse">
                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700" />
                <div className="flex gap-4">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700" />
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700" />
                </div>
            </div>

            {/* Hero Skeleton */}
            <div className="max-w-[90rem] mx-auto px-6 py-24 md:py-40">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="h-24 bg-gray-300 dark:bg-gray-700 w-full animate-pulse" />
                        <div className="h-20 bg-gray-300 dark:bg-gray-700 w-3/4 animate-pulse" />
                        <div className="h-12 bg-gray-300 dark:bg-gray-700 w-1/2 animate-pulse" />
                    </div>
                    <div className="aspect-[4/5] bg-gray-300 dark:bg-gray-700 animate-pulse" />
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="max-w-[90rem] mx-auto px-6 py-20">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 w-64 mb-12 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-square bg-gray-300 dark:bg-gray-700 animate-pulse" />
                            <div className="h-6 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 w-1/2 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
