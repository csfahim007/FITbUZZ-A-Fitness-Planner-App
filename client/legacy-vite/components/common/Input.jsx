const Input = ({ label, type = 'text', className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-md ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;