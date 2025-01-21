import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "@axios/api";

const DefaultSection = ({ api, className, title, ChildComponent }) => {
  const [sectionData, setSectionData] = useState([]);

  // const handleSectionData = async () => {
  //   try {
  //     const res = await Api.get(api);

  //     console.log("default section res: {}", res);

  //     setSectionData(res.data.data);
  //   } catch (error) {
  //     toast.error(
  //       error.message ||
  //         "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
  //     );
  //   }
  // };

  // useEffect(() => {
  //   handleSectionData();
  // }, [api]);

  return (
    <section
      className={`section ${className}`}
      style={{ border: "1px solid white", height: "350px" }}
    >
      {title ? <div className="section--title text-center">{title}</div> : null}

      <div>
        <ChildComponent data={sectionData} />
      </div>
    </section>
  );
};

export default DefaultSection;
