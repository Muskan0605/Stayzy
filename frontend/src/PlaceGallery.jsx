import { useState } from "react";

export default function PlaceGallery({ place}) {
    const [showAllPhotos, setShowAllPhotos] = useState(false);

      if (showAllPhotos) {
        return (
            <div className="absolute inset-0 bg-white min-w-full min-h-screen p-8 cursor-pointer">
                <div className="flex justify-between items-center cursor-pointer">
                    <h2 className="text-2xl font-bold">Photos of {place.title}</h2>
                    <button
                        onClick={() => setShowAllPhotos(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-2xl flex shadow-black shadow fixed right-12 top-8">
                        Close
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 rounded-3xl">
                    {place.photos?.map((photo, index) => (
                        <img 
                            key={index}
                            className="w-full h-auto object-cover rounded"
                            src={'http://localhost:4000/uploads/' + photo}
                            alt={`photo-${index}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {place.photos?.slice(0, 4).map((photo, index) => (
                    <img
                        key={index}
                        className="aspect-square object-cover rounded cursor-pointer"
                        src={`http://localhost:4000/uploads/${photo}`}
                        alt={`preview-${index}`}
                    />
                ))}
            </div>

            {place.photos?.length > 4 && (
                <div className="mt-8 w-full flex justify-end">
                    <button
                        onClick={() => setShowAllPhotos(true)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-2xl shadow shadow-gray-500 hover:bg-gray-700 transition flex gap-1"
                    >
                        Show More Photos
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
}
