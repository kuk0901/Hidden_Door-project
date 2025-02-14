import { useState, useEffect } from "react";
import { FaArrowCircleUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        // 500px 이상 스크롤 시 버튼 표시
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {showButton && (
        <button onClick={scrollToTop} className="btn scroll-to-top-button">
          <FaArrowCircleUp className="icon" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
