import React, { useState } from "react";
import Slider from "react-slick";


interface SingleProductSliderProps {
  product: {
    slug: string;
    imgAlt: string;
    thumbnail: {
      url: string;
    };
    images: [{
      url: string;
    }];
  };
}


const SingleProductSlider = ({ product }: SingleProductSliderProps) => {

  const { thumbnail, images, imgAlt, slug } = product;


  const [navSlider, setNavSlider] = useState(null);
  const [mainSlider, setMainSlider] = useState(null);
  const [zoomStyle, setZoomStyle] = useState(null);

  const mainSliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: navSlider,
    ref: (slider: any) => setMainSlider(slider), // Bind the main slider
  };

  const navSliderSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: mainSlider,
    dots: false,
    arrows: true,
    focusOnSelect: true,
    ref: (slider: any) => setNavSlider(slider), // Bind the nav slider
  };



  const productImages = [
    thumbnail.url,
    ...images.map((image) => image.url),
  ];

  const handleMouseMove = (e: any, image: any) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${image})`,
      backgroundPosition: `${x}% ${y}%`,
      display: "block",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null); // Hide zoom effect
  };

  return (
    <div className="single-pro-slider sticky top-[0] p-[15px] border-[1px] border-solid border-[#eee] rounded-[24px] max-[991px]:max-w-[500px] max-[991px]:m-auto">
      {/* Main Product Slider */}
      <div className="single-product-cover relative">
        <Slider {...mainSliderSettings}>
          {productImages.map((image, index) => (
            <div
              key={index}
              className="single-slide zoom-container rounded-tl-[15px] rounded-tr-[15px] overflow-hidden relative"
              onMouseMove={(e) => handleMouseMove(e, image)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="img-responsive rounded-tl-[15px] rounded-tr-[15px]"
                src={image}
                alt={index === 0 ? imgAlt : (`${slug}-${index + 1}`)}
              />
              {zoomStyle && (
                <div
                  className="zoom-overlay"
                  style={{
                    ...zoomStyle,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "200%", // Adjust zoom level
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                ></div>
              )}
            </div>
          ))}
        </Slider>
      </div>

      {/* Thumbnail Navigation Slider */}
      <div className="single-nav-thumb w-full overflow-hidden">
        <Slider {...navSliderSettings}>
          {productImages.map((image, index) => (
            <div key={index} className="single-slide px-[10px] block">
              <img
                className="img-responsive border-[1px] border-solid border-transparent transition-all duration-[0.3s] ease delay-[0s] cursor-pointer rounded-[15px]"
                src={image}
                alt={`${slug}-thumb-${index + 1}`}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SingleProductSlider;
