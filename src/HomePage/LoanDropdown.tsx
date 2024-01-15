import React, { useState, useEffect } from 'react';

interface LoanDropdownProps {
    onSelectLoan: (LoanId: string) => void; // Callback function to handle Loan selection
}

const LoanDropdown: React.FC<LoanDropdownProps> = ({ onSelectLoan }) => {
    const [Loans, setLoans] = useState<{ id: string, fullName: string }[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string>('');

    const mapApiResponseToFields = (apiData: any) => {
        return apiData.results.map((item: any) => ({
            id: item.LoanId,
            fullName: item.LoanName
        }));
    };

    useEffect(() => {
        fetch('/api/Loans')
            .then(response => response.json())
            .then(data => {
                const mappedData = mapApiResponseToFields(data);
                setLoans(mappedData);
            })
            .catch(error => console.error('Error fetching Loans:', error));
    }, []);

    // Handle dropdown change and call the onSelectLoan callback
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedLoanId(selectedValue);
        onSelectLoan(selectedValue); // Call the callback with the selected Loan ID
    };

    return (
        <div>
            <select value={selectedLoanId} onChange={handleDropdownChange}>
                <option value="*">--Select a LoanID--</option> {/* Add the initial "All" option */}
                {Loans.map((Loan, index) => (
                    <option key={index} value={Loan.id}>{Loan.fullName}</option>
                ))}
            </select>
        </div>
    );
};

export default LoanDropdown;
