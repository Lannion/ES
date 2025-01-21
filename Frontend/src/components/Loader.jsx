import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center p-2 mb-2">
      <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;