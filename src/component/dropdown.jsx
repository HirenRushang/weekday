import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import '../App.css';

const Dropdown = ({ options, value, onChange, defaultOptionText  }) => {


  return (
    <div className="custom-dropdown-container">
    <select className="custom-dropdown"  value={value} onChange={onChange}>
    <option value="">{defaultOptionText}</option>
    {options.map((option, index) => (
      <option key={index} value={option}>{option}</option>
    ))}
  </select>
      <FaAngleDown className="dropdown-icon" />
    </div>
  );
};

export default Dropdown;






