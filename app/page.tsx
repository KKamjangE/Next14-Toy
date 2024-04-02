export default function Home() {
    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center p-5">
            <div
                className="bg-white w-full max-w-screen-sm p-5
                flex flex-col gap-3
                shadow-lg rounded-3xl"
            >
                <div className="group flex flex-col">
                    <input
                        className="bg-gray-100 w-full"
                        type="text"
                        placeholder="Write your email"
                    />
                    <span className="group-focus-within:block hidden">
                        Make sure it is a valid email...
                    </span>
                    <button>Submit</button>
                </div>
            </div>
        </main>
    );
}
