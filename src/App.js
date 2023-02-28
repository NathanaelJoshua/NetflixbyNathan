import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { Account } from './pages/Account';
import Home from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Search } from './pages/Search';
import { AuthContextProvider } from './context/AuthContext.js'
import MoviesPage from './pages/MoviesPage';
import TvShowsPage from './pages/TvShowsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MyList } from './pages/MyList';
import { ProtectedRoute2 } from './components/ProtectedRoute2';
import { ModalDetail } from './components/ModalDetail';
import { useState } from 'react';
import ModalContext from './context/ModalContext';

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [modalType, setModalType] = useState(null);

  const showModal = (id, type) => {
    setIsModalVisible(true);
    setModalId(id);
    setModalType(type);
  };
  return (
    <div className='App'>
      <AuthContextProvider>
      <ModalContext.Provider value={{ showModal }}>
      <Navbar/>
      <Routes>
        <Route path='/NetflixbyNathan' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path='/login' element={<ProtectedRoute2><Login/></ProtectedRoute2>}/>
        <Route path='/signup' element={<ProtectedRoute2><SignUp/></ProtectedRoute2>}/>
        <Route path='/account' element={<ProtectedRoute><Account/></ProtectedRoute>}/> 
        <Route path='/search' element={<ProtectedRoute><Search/></ProtectedRoute>}/> 
        <Route path='/movies' element={<ProtectedRoute><MoviesPage/></ProtectedRoute>}/> 
        <Route path='/tvshows' element={<ProtectedRoute><TvShowsPage/></ProtectedRoute>}/> 
        <Route path='/mylist' element={<ProtectedRoute><MyList/></ProtectedRoute>}/> 

      </Routes> 
      {isModalVisible && <ModalDetail id={modalId} type={modalType} onClose={() => setIsModalVisible(false)} />}
      </ModalContext.Provider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
