import './App.css';
import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PagePlace from './pages/PlacePage';
import BookingsPages from './pages/BookingsPages';
import BookingPage from './pages/BookingPage';

axios.defaults.baseURL = 'https://stayzy-ipgk.onrender.com/';
axios.defaults.withCredentials = true;


function App(){
 
  return(
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<IndexPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/account" element={<ProfilePage/>}/>
        <Route path="/account/places" element={<PlacesPage/>}/>
        <Route path="/account/places/new" element={<PlacesFormPage/>}/>
        <Route path="/account/places/:id" element={<PlacesFormPage/>}/>
        <Route path="/place/:id" element={<PagePlace/>}/>
        <Route path="/account/bookings" element={<BookingsPages/>}/>
        <Route path="/account/booking/:id" element={<BookingPage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>
  )
}

export default App;