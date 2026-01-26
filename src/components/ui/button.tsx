import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:shadow-elevated hover:scale-[1.02] active:scale-[0.97] active:shadow-soft",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 active:scale-[0.97]",
        outline:
          "border border-slate-600 bg-slate-800/80 text-slate-100 hover:bg-slate-700 hover:text-white active:scale-[0.97] active:bg-slate-800",
        "outline-light":
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 active:scale-[0.97]",
        ghost: 
          "hover:bg-accent hover:text-accent-foreground active:bg-accent/80 active:scale-[0.97]",
        link: 
          "text-primary underline-offset-4 hover:underline active:opacity-80",
        hero:
          "bg-primary text-primary-foreground shadow-elevated hover:shadow-glow hover:scale-[1.03] active:scale-[0.97] active:shadow-soft font-semibold",
        subtle:
          "bg-accent/50 text-accent-foreground hover:bg-accent active:scale-[0.97]",
      },
      size: {
        default: "h-11 min-h-[44px] px-5 py-2",
        sm: "h-10 min-h-[40px] rounded-md px-4 text-xs",
        lg: "h-12 min-h-[48px] rounded-lg px-8 text-base",
        xl: "h-14 min-h-[56px] rounded-xl px-10 text-lg",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
