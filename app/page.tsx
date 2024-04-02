export default function Home() {
    return (
        <main className="bg-gray-200 h-screen flex items-center justify-center p-5">
            <div
                className="bg-white w-full max-w-screen-sm p-5
                flex flex-col gap-3
                shadow-lg rounded-3xl"
            >
                {["Nico", "Me", "You", "Yourself", ""].map((person, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="size-10 bg-blue-400 rounded-full" />
                        <span className="text-lg font-medium empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300">
                            {person}
                        </span>
                        <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full relative animate-bounce">
                            <span className="z-10">{index}</span>
                            <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
