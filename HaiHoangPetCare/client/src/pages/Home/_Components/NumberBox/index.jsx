// ô chọn số với nút cộng trừ

import React from "react";
// import React, { useState } from "react";

const NumberBox = ({ value, setValue }) => {
  const handleDecrement = () => {
    if (value > 1) setValue((prev) => prev - 1);
  };

  const handleIncrement = () => {
    setValue((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor="custom-input-number"
        className="text-gray-700 text-sm font-semibold mb-1"
      >
        Số lượng
      </label>

      <div className="flex flex-row h-10 w-32 rounded-lg relative bg-transparent">
        {/* Nút trừ */}
        <button
          onClick={handleDecrement}
          className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-l cursor-pointer outline-none"
        >
          <span className="m-auto text-xl font-thin">−</span>
        </button>

        {/* Ô nhập số */}
        <input
          type="number"
          id="custom-input-number"
          value={value}
          onChange={(e) => {
            const newVal = Math.max(1, Number(e.target.value));
            setValue(newVal);
          }}
          className="outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black flex items-center text-gray-700"
        />

        {/* Nút cộng */}
        <button
          onClick={handleIncrement}
          className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-r cursor-pointer outline-none"
        >
          <span className="m-auto text-xl font-thin">+</span>
        </button>
      </div>

      <style>{`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default NumberBox;
