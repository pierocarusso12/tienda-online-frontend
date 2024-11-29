const API_URL = 'https://localhost:7279/api';

export const getProducts = async (page = 1, pageSize = 6) => {
    try {
        const response = await fetch(`${API_URL}/products?page=${page}&pageSize=${pageSize}`);
        if (!response.ok) throw new Error('Error al cargar productos');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];
        
        const response = await fetch(`${API_URL}/cart`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar carrito');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
    }
};

export const addToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autorizado');

    const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            productId,
            quantity: 1
        }),
    });
    if (!response.ok) throw new Error('Error al añadir al carrito');
    return await response.json();
};

export const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autorizado');

    const response = await fetch(`${API_URL}/cart/${productId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Error al eliminar del carrito');
    return true;
};

export const updateCartItem = async (cartItemId, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No autorizado');

    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Error al actualizar carrito');
    return await response.json();
};