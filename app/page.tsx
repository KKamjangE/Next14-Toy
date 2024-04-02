export default function Home() {
    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center p-5 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100">
            <div className="bg-white w-full max-w-screen-sm shadow-lg p-5 rounded-3xl flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="w-full rounded-full bg-gray-200 pl-5 h-12 ring ring-transparent focus:ring-orange-500 outline-none transition-shadow placeholder:drop-shadow"
                />
                <button className="bg-black text-white rounded-full h-12 active:scale-90 transition-transform font-medium md:px-10">
                    Search
                </button>
            </div>
        </main>
    );
}
