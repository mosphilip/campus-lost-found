import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import PostItem from './PostItem'
import Signup from './Signup'
import ItemDetail from './ItemDetail'
import Dashboard from './Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
