
"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastIcon,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                <div className="h-full bg-white animate-toast-progress origin-left" />
            </div>
            <div className="flex items-start gap-3 w-full">
                <ToastIcon variant={props.variant} />
                <div className="grid gap-1 flex-grow">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
