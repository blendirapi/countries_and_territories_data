import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getCountriesList = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag');
                const data = await response.json();
                setCountries(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getCountriesList();
    }, []);

    const sortedCountries = [...countries];
    sortedCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    const getCountryValue = async (event) => {
        const countryName = event.target.value;

        setIsLoading(true);

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
            const data = await response.json();
            setSelectedCountry(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <p className="text-center text-gray-800 text-5xl">Countries & Territories Data</p>
            <select
                className="text-lg rounded-md"
                onChange={getCountryValue}
                value={selectedCountry.name?.common || ''}
            >
                <option hidden>Select a Country</option>
                {sortedCountries.map((country) => (
                    <option key={country.name.common} value={country.name.common}>
                        {country.flag} {country.name.common}
                    </option>
                ))}
            </select>

            {isLoading && (
                <p className="text-center text-gray-800">Loading...</p>
            )}

            {selectedCountry.length > 0 && !isLoading && (
                <div className="text-center mt-5">
                    <p>
                        <img
                            className="h-48 mx-auto"
                            src={selectedCountry[0].flags.svg}
                            alt={`${selectedCountry[0].name.common} Flag`}
                        />
                    </p>
                    <p className="mt-2 text-3xl">{selectedCountry[0].name.common} | {selectedCountry[0].cca2}</p>
                    <p className="text-xl">{selectedCountry[0].name.official}</p>
                    <table className="w-full border-collapse mt-2">
                        <tbody>
                                <tr>
                                    <td className="border p-2 text-left bg-gray-200">Capital:</td>
                                    <td className="border p-2 text-left">{selectedCountry[0].capital}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2 text-left bg-gray-200">Population:</td>
                                    <td className="border p-2 text-left">{selectedCountry[0].population}</td>
                                </tr>
                                <tr>
                                    <td className="border p-2 text-left bg-gray-200">Internet TLD:</td>
                                    <td className="border p-2 text-left">{selectedCountry[0].tld}</td>
                                </tr>
                        </tbody>
                    </table>
                    <a href={selectedCountry[0].maps.openStreetMaps} target="_blank">
                        <p className="mt-2">View on map🔗</p>
                    </a>
                </div>
            )}
        </>
    );
}

export default App;

