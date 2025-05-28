import { useState } from 'react';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === 'admin';
  const { cart } = useCartStore();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg border-b border-emerald-800 z-50'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
        {/* Brand */}
        <Link to='/' className='text-2xl font-bold text-emerald-400 hover:cursor-pointer'>
          E-Commerce
        </Link>

        {/* Desktop Nav */}
        <nav className='hidden sm:flex items-center gap-6'>
          <Link to='/' className='text-gray-300 hover:text-emerald-400 transition'>Home</Link>

          {user && (
            <Link to='/cart' className='relative text-gray-300 hover:text-emerald-400 transition'>
              <ShoppingCart className='inline-block mr-1' size={20} />
              <span className='hidden sm:inline'>Cart</span>
              {cart.length > 0 && (
                <span className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs'>
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link to='/secret-dashboard' className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium flex items-center transition'>
              <Lock size={18} className='mr-1' />
              <span className='hidden sm:inline'>Dashboard</span>
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition'
            >
              <LogOut size={18} />
              <span className='hidden sm:inline ml-2'>Log Out</span>
            </button>
          ) : (
            <>
              <Link to='/signup' className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition'>
                <UserPlus size={18} className='mr-2' />
                Sign Up
              </Link>
              <Link to='/login' className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition'>
                <LogIn size={18} className='mr-2' />
                Log In
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className='sm:hidden text-gray-300'>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className='sm:hidden bg-gray-900 border-t border-emerald-800 px-4 py-4 space-y-4'>
          <Link onClick={closeMenu} to='/' className='block text-gray-300 hover:text-emerald-400 transition'>Home</Link>

          {user && (
            <Link onClick={closeMenu} to='/cart' className='block text-gray-300 hover:text-emerald-400 transition relative'>
              <ShoppingCart className='inline-block mr-1' size={20} />
              Cart
              {cart.length > 0 && (
                <span className='absolute top-0 left-16 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs'>
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {isAdmin && (
            <Link onClick={closeMenu} to='/secret-dashboard' className='block bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-md font-medium flex items-center transition'>
              <Lock size={18} className='mr-1' />
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className='w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition'
            >
              <LogOut size={18} />
              <span className='ml-2'>Log Out</span>
            </button>
          ) : (
            <>
              <Link onClick={closeMenu} to='/signup' className='block bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition'>
                <UserPlus size={18} className='mr-2' />
                Sign Up
              </Link>
              <Link onClick={closeMenu} to='/login' className='block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition'>
                <LogIn size={18} className='mr-2' />
                Log In
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
