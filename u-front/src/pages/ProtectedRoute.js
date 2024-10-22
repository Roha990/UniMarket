import React, { useEffect, useState } from 'react';
import api from '../services/apiService';

const ProtectedComponent = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await api.get('/protected');
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProtectedData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Protected Data</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default ProtectedComponent;