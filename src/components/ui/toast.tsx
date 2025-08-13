
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle, Palette, Check, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex max-h-screen w-full max-w-[90vw] flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:top-auto sm:left-auto sm:translate-x-0 sm:w-full sm:max-w-sm",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full sm:data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background/80 backdrop-blur-lg text-foreground",
        destructive: "destructive group border-destructive bg-destructive/10 text-foreground",
        success: "success group border-green-500 bg-background/80 backdrop-blur-lg text-foreground",
        warning: "warning group border-orange-500 bg-orange-500/10 text-foreground",
        info: "info group border-sky-500 bg-sky-500/10 text-foreground",
        prosesDesain: "proses-desain group border-orange-500 bg-background/80 backdrop-blur-lg text-foreground",
        prosesAcc: "proses-acc group border-sky-500 bg-background/80 backdrop-blur-lg text-foreground",
        selesai: "selesai group border-green-500 bg-background/80 backdrop-blur-lg text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant = "default", ...props }, ref) => {
  const statusColorClass = 
      variant === "prosesDesain" ? "before:bg-orange-500"
    : variant === "prosesAcc" ? "before:bg-sky-500"
    : variant === "selesai" ? "before:bg-green-500"
    : variant === "success" ? "before:bg-green-500"
    : variant === "destructive" ? "before:bg-red-500"
    : variant === "warning" ? "before:bg-orange-500"
    : variant === "info" ? "before:bg-sky-500"
    : "";

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }), 
        "before:absolute before:left-0 before:top-0 before:h-full before:w-1",
        statusColorClass,
        className
      )}
      {...props}
    >
      {props.children}
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-red-100/40 group-[.destructive]:hover:bg-red-800",
      "group-[.success]:border-green-100/40 group-[.success]:hover:bg-green-800",
      "group-[.warning]:border-orange-100/40 group-[.warning]:hover:bg-orange-800",
      "group-[.info]:border-sky-100/40 group-[.info]:hover:bg-sky-800",
      "group-[.proses-desain]:border-orange-100/40 group-[.proses-desain]:hover:bg-orange-800",
      "group-[.proses-acc]:border-sky-100/40 group-[.proses-acc]:hover:bg-sky-800",
      "group-[.selesai]:border-green-100/40 group-[.selesai]:hover:bg-green-800",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-inherit/50 opacity-0 transition-opacity hover:text-inherit focus:opacity-100 focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-xxs font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-xxs opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

const ToastIcon = ({ variant }: { variant: ToastProps["variant"] }) => {
    const iconClass = "h-5 w-5";
    const iconMap = {
        destructive: <AlertCircle className={cn(iconClass, "text-red-400")} />,
        success: <CheckCircle2 className={cn(iconClass, "text-green-400")} />,
        selesai: <CheckCircle2 className={cn(iconClass, "text-green-400")} />,
        warning: <AlertTriangle className={cn(iconClass, "text-orange-400")} />,
        info: <Info className={cn(iconClass, "text-sky-400")} />,
        default: <Info className={cn(iconClass, "text-primary")} />,
        prosesDesain: <Palette className={cn(iconClass, "text-orange-400")} />,
        prosesAcc: <Wrench className={cn(iconClass, "text-sky-400")} />,
    };
  
  const icon = variant ? iconMap[variant] : iconMap.default;
  if (!icon) return null;

  return <div className="z-10 flex-shrink-0">{icon}</div>;
};


export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
