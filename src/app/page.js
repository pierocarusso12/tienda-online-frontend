'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getCart, addToCart, removeFromCart } from './services/api';
import { LoginModal } from './components/Login';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const username = localStorage.getItem('username');
      if (username) {
        showNotification(`Bienvenido(a) de nuevo, ${username}`, 'success');
      }
    }
    fetchProducts();
    fetchCart();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 
    setIsLoggedIn(false);
    setCart([]);
    showNotification('Sesión cerrada exitosamente', 'success');
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts(currentPage, PAGE_SIZE);
      setProducts(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError('Error al cargar productos');
      showNotification('Error al cargar productos', 'error');
    }
  };

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error) {
      showNotification('Error al cargar el carrito', 'error');
    }
  };

  const handleAddToCart = async (productId) => {
    if (!isLoggedIn) {
      showNotification('Debe iniciar sesión para agregar al carrito', 'error');
      setShowLogin(true);
      return;
    }
  
    try {
      
      const existingItem = cart.find(item => item.product.id === productId);
      
      if (existingItem) {
       
        await updateCartItem(existingItem.id, existingItem.quantity + 1);
      } else {
        
        await addToCart(productId);
      }
      
      await fetchCart();
      showNotification('Producto agregado al carrito', 'success');
    } catch (error) {
      showNotification('Error al agregar al carrito', 'error');
    }
};

  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      await fetchCart();
      showNotification('Producto eliminado del carrito', 'success');
    } catch (error) {
      showNotification('Error al eliminar del carrito', 'error');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 1500);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product?.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white z-50 transform transition-all duration-300 ease-in-out`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
<header className="bg-white shadow-sm sticky top-0 z-30">
  <div className="container mx-auto px-4 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Mi Tienda Online</h1>
        {isLoggedIn && (
          <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
            Bienvenido(a), <span className="font-semibold">{localStorage.getItem('username')}</span>
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" 
                clipRule="evenodd" 
              />
            </svg>
            Iniciar Sesión
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        )}

        <button 
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="w-6 h-6 text-gray-800" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cart.length}
            </span>
          )}
        </button>
      </div>
    </div>
  </div>
</header>

      {/* Login Modal */}
      <LoginModal 
  isOpen={showLogin}
  onClose={() => setShowLogin(false)}
  onLogin={(token, username) => {
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    showNotification(`Bienvenido(a) ${username}`, 'success');
    setShowLogin(false);
    fetchCart();
  }}
/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative group">
                <img
                  src={`https://localhost:7279${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-64 object-contain p-4"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"/>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-10 h-10 rounded-full transition-colors duration-200 ${
                currentPage === i + 1
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300">
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Carrito de Compras</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay productos en el carrito</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-200">
                        <img
                          src={`https://localhost:7279${item.product.imageUrl}`}
                          alt={item.product.name}
                          className="w-20 h-20 object-contain rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{item.product.name}</h3>
                          <p className="text-gray-600">Cantidad: {item.quantity}</p>
                          <p className="font-bold text-blue-600">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex justify-between items-center text-xl font-bold text-gray-800">
                      <span>Total:</span>
                      <span className="text-blue-600">${calculateTotal()}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}