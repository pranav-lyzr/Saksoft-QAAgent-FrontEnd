declare module '../components/ui/button' {
  const Button: React.FC<{
    onClick?: () => void;
    className?: string;
    variant?: 'outline' | 'solid';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
  }>;
  export default Button;
} 