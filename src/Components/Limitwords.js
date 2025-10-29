import React, { useState } from "react";
import "./Limitwords.css";

function LimitedTextarea({ label = "Product Description", maxWords = 6, value = "", onChange }) {
  const [text, setText] = useState(value);

  const handleChange = (e) => {
    const input = e.target.value.trimStart();
    const words = input.split(/\s+/);

    let newValue;
    if (words.length <= maxWords) {
      newValue = input;
    } else {
      newValue = words.slice(0, maxWords).join(" ");
    }
    
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const progress = (wordCount / maxWords) * 100;

  return (
    <div className="limited-textarea-container">
      <p className="limit-label">{label}</p>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Enter product description"
        className={`limited-textarea ${wordCount >= maxWords ? "limit-hit" : ""}`}
      />
      <div className="progress-bar">
        <div
          className={`progress-fill ${wordCount >= maxWords ? "full" : ""}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={`word-count ${wordCount >= maxWords ? "limit-text" : ""}`}>
        {maxWords - wordCount} words remaining
      </p>
    </div>
  );
}

export default LimitedTextarea;
