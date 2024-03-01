import React, { useState, useEffect } from 'react';

interface Client {
    id: string;
    fullName: string;
}

interface ClientDropdownProps {
    onSelectClient: (clientId: string) => void;
}

const ClientDropdown: React.FC<ClientDropdownProps> = ({ onSelectClient }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [displayClients, setDisplayClients] = useState<Client[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        fetch('/api/clients')
            .then(response => response.json())
            .then(data => {
                const clients = data.results.map((item: any) => ({
                    id: item.ClientId,
                    fullName: item.ClientName,
                }));
                clients.sort((a: Client, b: Client) =>
                    a.fullName.localeCompare(b.fullName)
                );
                setClients(clients);
                setDisplayClients(clients);
            })
            .catch(error => console.error('Error fetching clients:', error));
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setDisplayClients(clients);
        } else {
            const filteredClients = clients.filter(client =>
                client.fullName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setDisplayClients(filteredClients);
        }
    }, [searchTerm, clients]);

    const handleSelectClient = (clientId: string) => {
        onSelectClient(clientId);
        setDropdownOpen(false);
        setSearchTerm('');
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder="Search clients..."
                style={{ width: '200px', marginLeft:"3px" }}
            />
            {dropdownOpen && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    maxHeight: '200px',
                    width: '200px',
                    overflowY: 'auto',
                    cursor: 'pointer',
                    zIndex: 1000, // ensure it's on top of other elements
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderTop: 'none', // seamless connection with the input
                    listStyleType: 'none',
                    padding: 0,
                    margin: 0,
                }}>
                    <li onClick={() => handleSelectClient("*")}
                        style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                        ALL

                    </li>
                    {displayClients.map((client, index) => (
                        <li key={index} onClick={() => handleSelectClient(client.id)}
                            style={{padding: '10px', borderBottom: '1px solid #ddd'}}>
                            {client.fullName}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ClientDropdown;
