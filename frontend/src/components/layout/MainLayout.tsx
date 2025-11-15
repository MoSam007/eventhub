import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from './Footer'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function MainLayout() {
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initAuth()
  }, [initAuth])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}