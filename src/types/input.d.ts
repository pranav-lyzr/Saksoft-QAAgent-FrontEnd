declare module '../components/ui/input' {
  const Input: React.FC<{
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }>;
  export default Input;
} 