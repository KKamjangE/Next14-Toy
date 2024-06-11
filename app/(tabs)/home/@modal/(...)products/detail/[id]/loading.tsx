import CloseButton from "@/components/close-button";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
    return (
        <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-60">
            <CloseButton />
            <div className="flex h-1/2 w-full max-w-screen-sm justify-center">
                <div className="flex aspect-square items-center justify-center rounded-md bg-neutral-700 text-neutral-200">
                    <PhotoIcon className="h-28" />
                </div>
            </div>
        </div>
    );
}
