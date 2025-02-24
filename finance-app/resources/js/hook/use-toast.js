import { useState, useCallback } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(
    ({ title, description, type = 'default', duration = 3000 }) => {
      const id = Math.random().toString(36).substr(2, 9)
      
      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, description, type, duration },
      ])

      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        )
      }, duration)
    },
    []
  )

  return { toast, toasts }
}