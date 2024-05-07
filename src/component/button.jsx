import React from 'react';
import '../App.css'

const Button = ({ icon, text, color, textColor, fWeight }) => {
    const buttonStyle = {
        backgroundColor: color,
        color: textColor,
        fontWeight: fWeight
      
       
      };
    
  return (
    <div className="button" style={buttonStyle}>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </div>
  );
};

export default Button;
