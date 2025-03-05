import React from "react";

const Button = ({ disabled, children, className, onClickhandler, type }) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`${className}`}
      onClick={onClickhandler}
    >
      {children}
    </button>
  );
};

export default Button;
