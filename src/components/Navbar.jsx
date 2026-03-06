import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-indigo-900 text-white gap-8 py-2">
      <div className="logo">
        <span className="font-bold text-xl mx-9">TaskPad</span>
      </div>
      <ul className="flex gap-8 mx-9">
        <li className="cursor-pointer hover:font-bold transition-all duration-50">Home</li>
        <li className="cursor-pointer hover:font-bold transition-all duration-50">Your Task</li>
        <li className="cursor-pointer hover:font-bold transition-all duration-50">Home</li>
      </ul>
    </nav>
  );
};

export default Navbar;
