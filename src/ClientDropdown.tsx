import React, { useState, useEffect } from 'react';

const ClientDropdown: React.FC = () => {
    const [clients, setClients] = useState<{ id: string, fullName: string }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');

    const mapApiResponseToFields = (apiData: any) => {
        return apiData.results.map((item: any) => ({
            id: item.Client_id,
            fullName: item.FirstName + " " + item.LastName
        }));
    };

    useEffect(() => {
        fetch('/api/clients')
            .then(response => response.json())
            .then(data => {
                const mappedData = mapApiResponseToFields(data);
                setClients(mappedData);
            })
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    // Handle dropdown change
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClientId(event.target.value);
    };

    return (
        <div>
            <select value={selectedClientId} onChange={handleDropdownChange}>
                {clients.map((client, index) => (
                    <option key={index} value={client.id}>{client.fullName}</option>
                ))}
            </select>
        </div>
    );
};

export default ClientDropdown;

