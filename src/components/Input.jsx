import React from "react";
import { useId } from "react";

const Input = React.forwardRef(function Input(
  { label, type = "text", placeholder, className = "", ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label className="inline-block mb-1 pl-1" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-lg px-3 py-2 bg-white text-black outline-none border border-gray-200 duration-200 focus:bg-gray-50 ${className}`}
        ref={ref} // ref should come after ...props
        {...props} // Always spread props after ref and id
      />
    </div>
  );
});

export default Input;
