import React, { useState, useEffect } from 'react';

const FilterPage: React.FC = () => {
    const [names, setNames] = useState<string[]>([]);
    const [selectedName, setSelectedName] = useState<string>('');

    // Fetch names from the backend on component mount
    useEffect(() => {
        fetch('/api/names')
            .then(response => response.json())
            .then(data => {
                setNames(data.results);
            })
            .catch(error => console.error('Error fetching names:', error));
    }, []);

    // Handle dropdown change
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedName(event.target.value);
    };

    return (
        <div>
            
            <select onChange={handleDropdownChange} value={selectedName}>
                {names.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                ))}
            </select>
            

        </div>
    );
};

export default FilterPage;
