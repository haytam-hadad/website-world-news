"use client";

import React from 'react';

const ErrorComponent = ({ message }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
};

export default ErrorComponent;

