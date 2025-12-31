'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, X } from 'lucide-react'

interface AIConnectionNotificationProps {
  className?: string
}

export function AIConnectionNotification({ className }: AIConnectionNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAIConnectionLost = (event: CustomEvent) => {
      setMessage(event.detail.message || 'Koneksi ke AI terputus, menggunakan data simulasi')
      setIsVisible(true)
      
      // Auto hide after 10 seconds
      setTimeout(() => {
        setIsVisible(false)
      }, 10000)
    }

    // Listen for AI connection lost events
    window.addEventListener('aiConnectionLost', handleAIConnectionLost as EventListener)

    return () => {
      window.removeEventListener('aiConnectionLost', handleAIConnectionLost as EventListener)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md ${className}`}>
      <Alert className="border-orange-200 bg-orange-50 text-orange-800">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="flex-1 pr-2">{message}</span>
          <button
            onClick={() => setIsVisible(false)}
            className="text-orange-600 hover:text-orange-800 transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="h-4 w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  )
}