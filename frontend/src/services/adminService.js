const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';

export const getAdminStats = async (token) => {
    const res = await fetch(`${API_URL}/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
};

export const createGlobalHabit = async (habitData, token) => {
    const res = await fetch(`${API_URL}/habitos-globales`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(habitData)
    });
    return res.json();
};