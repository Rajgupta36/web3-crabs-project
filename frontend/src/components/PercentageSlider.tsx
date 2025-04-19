import React, { useState, useEffect } from 'react';

interface PercentageSliderProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({
  value,
  onChange,
  max = 100,
  min = 0
}) => {
  const [percentage, setPercentage] = useState(value);

  useEffect(() => {
    setPercentage(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setPercentage(newValue);
    onChange(newValue);
  };

  // Calculate the gradient based on the current value
  const calculateGradient = () => {
    const percent = ((percentage - min) / (max - min)) * 100;
    return `linear-gradient(to right, #000000 0%, #7C3AAA ${percent}%, #E5E7AC ${percent}%, #E5EACF 100%)`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">0%</span>
        <span className="text-sm font-medium text-gray-600 ">{percentage}%</span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">100%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={percentage}
        onChange={handleChange}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: calculateGradient(),
          WebkitAppearance: 'none'
        }}
      />
    </div>
  );
};

export default PercentageSlider;