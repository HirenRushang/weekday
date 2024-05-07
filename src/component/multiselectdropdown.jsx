import React, { useState } from 'react';

const MultiSelectDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(item => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div>
      <div style={{display: "inline-block"}}>
        <button onClick={toggleDropdown}>{isOpen ? "▲" : "▼"}</button>
        {isOpen && (
          <div>
            {options.map(option => (
              <div key={option}>
                <input
                  type="checkbox"
                  id={option}
                  value={option}
                  onChange={() => toggleOption(option)}
                  checked={selectedOptions.includes(option)}
                />
                <label htmlFor={option}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3>Selected Options:</h3>
        <ul>
          {selectedOptions.map(option => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
