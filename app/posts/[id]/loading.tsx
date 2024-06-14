export default function Loading() {
    return (
        <div className="flex animate-pulse flex-col gap-5 p-5">
            <div className="flex flex-col gap-5 border-b border-neutral-600 pb-5 *:rounded-md">
                <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-neutral-700" />
                    <div className="flex flex-col gap-2 *:rounded-md">
                        <div className="h-3 w-40 bg-neutral-700" />
                        <div className="h-3 w-20 bg-neutral-700" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 *:rounded-md">
                    <div className="h-5 w-20 bg-neutral-700" />
                    <div className="h-5 w-40 bg-neutral-700" />
                </div>
                <div className="h-5 w-40 bg-neutral-700" />
                <div className="h-5 w-40 bg-neutral-700" />
            </div>
            {[...Array(10)].map((_, index) => (
                <div key={index} className="flex flex-col gap-5 *:rounded-md">
                    <div className="flex items-center gap-2">
                        <div className="size-7 rounded-full bg-neutral-700" />
                        <div className="flex flex-col gap-2 *:rounded-md">
                            <div className="h-3 w-40 bg-neutral-700" />
                            <div className="h-3 w-20 bg-neutral-700" />
                        </div>
                    </div>
                    <div className="h-5 w-80 bg-neutral-700" />
                </div>
            ))}
        </div>
    );
}
