export default function Home() {
    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center p-5">
            <div className="bg-white w-full max-w-screen-sm shadow-lg p-5 rounded-3xl flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full rounded-full bg-gray-200 pl-5 h-12 ring ring-transparent focus:ring-orange-500 outline-none transition-shadow placeholder:drop-shadow"
                />
                <button className="bg-black text-white rounded-full h-12 active:scale-90 focus:scale-90 transition-transform font-medium">
                    Search
                </button>
            </div>
        </main>
    );
}
