import React from 'react';
import imageone from "../assets/images/imageone.png";
import imagetwo from "../assets/images/imagetwo.png";
import imagethree from "../assets/images/imagethree.png";

const Categories = () => {
  return (
    <div className="container flex flex-col md:flex-row max-w-6xl items-center justify-between mx-auto py-6 gap-5">
      {[imageone, imagetwo, imagethree].map((image, index) => (
        <div
          key={index}
          className="overflow-hidden group w-full md:w-1/3"
        >
          <img
            src={image}
            alt={`category-${index}`}
            className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
    </div>
  );
};

export default Categories;
