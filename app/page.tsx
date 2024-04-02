export default function Home() {
    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center p-5 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100">
            <div className="bg-white w-full max-w-screen-sm shadow-lg p-5 rounded-3xl flex flex-col md:flex-row gap-2">
                <input
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-full bg-gray-200 pl-5 h-12
                    ring ring-transparent focus:ring-orange-500
                    outline-none transition-shadow placeholder:drop-shadow
                  invalid:focus:ring-red-500 peer"
                    required
                />
                <span className="text-red-500 font-medium hidden peer-invalid:block">
                    Email is required.
                </span>
                <button
                    className="text-white bg-black rounded-full h-12 active:scale-90 transition-transform 
                font-medium md:px-10"
                >
                    Log in
                </button>
            </div>
        </main>
    );
}
