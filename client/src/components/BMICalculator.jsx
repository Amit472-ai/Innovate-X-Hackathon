import React, { useState } from 'react';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / (h * h);
      setBmi(bmiValue.toFixed(1));
      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue < 25) setCategory('Normal weight');
      else if (bmiValue < 30) setCategory('Overweight');
      else setCategory('Obesity');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">BMI Calculator</h2>
      <form onSubmit={calculateBMI} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm):</label>
          <input
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg):</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Calculate</button>
      </form>
      {bmi && (
        <div className="mt-6 text-center">
          <div className="text-lg font-semibold">Your BMI: <span className="text-blue-600">{bmi}</span></div>
          <div className="mt-2 font-medium">Category: <span className="text-indigo-600">{category}</span></div>
          <div className="mt-4">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-4 rounded-full ${bmi < 18.5 ? 'bg-yellow-400' : bmi < 25 ? 'bg-green-500' : bmi < 30 ? 'bg-orange-400' : 'bg-red-500'}`}
                style={{ width: `${Math.min((bmi / 40) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
