import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function IndexPage() {
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(response => {
            setPlaces(response.data);
        });
    }, []);

    return(
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 text-center gap-x-6 gap-y-8">
            {places.length > 0 && places.map(place => (
                <Link to={'/place/'+place._id}>
                <div className="rounded-2xl flex bg-gray-200 justify-center mb-2">
                    {place.photos?.[0] && (
                    <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+place.photos?.[0]} alt=''/>
                )}
                </div>
                <h3 className="text-start font-bold">{place.address}</h3>
                <h2 className="text-sm text-start text-gray-500">{place.title}</h2>
                <div className="text-start mt-1">
                  <span className="font-bold">${place.price}</span> per night
                </div>
                </Link>
            ))}
        </div>
    );
}