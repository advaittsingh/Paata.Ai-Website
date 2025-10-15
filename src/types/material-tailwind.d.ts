// Type declarations to fix Material Tailwind component prop issues
declare module '@material-tailwind/react' {
  export interface TypographyProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface ButtonProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface CardProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface CardBodyProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface CardHeaderProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface InputProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
    crossOrigin?: string;
  }

  export interface SelectProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
  }

  export interface SwitchProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
    crossOrigin?: string;
  }

  export interface AvatarProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
    useMap?: string;
  }

  export interface IconButtonProps {
    placeholder?: string;
    onResize?: () => void;
    onResizeCapture?: () => void;
    onPointerEnterCapture?: () => void;
    onPointerLeaveCapture?: () => void;
    ripple?: boolean;
  }
}

