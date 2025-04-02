import React from 'react';

export const Controls: React.FC = () => {
  return (
    <div className="controls flex gap-4 justify-center">
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Fire Laser
      </button>
      <button className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
        Reset
      </button>
    </div>
  );
};
