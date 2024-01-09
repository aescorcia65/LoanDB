import React, { useState, useEffect } from 'react';

interface MonthDropdownProps {
    onSelectClient: (clientId: string) => void; // Callback function to handle client selection
}

const ClientDropdown: React.FC<MonthDropdownProps> = ({ onSelectClient }) => {
    const [clients, setClients] = useState<{ id: string, fullName: string }[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');

    const mapApiResponseToFields = (apiData: any) => {
        return apiData.results.map((item: any) => ({
            id: item.Client_id,
            fullName: item.ClientName
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

    // Handle dropdown change and call the onSelectClient callback
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedMonthId(selectedValue);
        onSelectMonth(selectedValue); // Call the callback with the selected client ID
    };

    return (
        <div>
            <select value={selectedMonthId} onChange={handleDropdownChange}>
                <option value="*">--ALL--</option> {/* Add the initial "All" option */}
                {clients.map((client, index) => (
                    <option key={index} value={client.id}>{client.fullName}</option>
                ))}
            </select>
        </div>
    );
};

export default MonthDropdown;
