import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Api from "@axios/api";

const DefaultSection = ({ api, className, title, ChildComponent }) => {
  const [sectionData, setSectionData] = useState([]);

  const handleSectionData = async () => {
    try {
      const res = await Api.get(api);

      if (res.status !== 200) {
        toast.error("관련 데이터를 불러오지 못했습니다.");
        return;
      }

      setSectionData(res.data?.data);
    } catch (error) {
      toast.error(
        error.message ||
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    handleSectionData();
  }, []);

  return (
    <section className={`section--default ${className}`}>
      {title ? (
        <div className="section--title text-center bold">{title}</div>
      ) : null}

      <div className="section--content">
        <ChildComponent data={sectionData} setSectionData={setSectionData} />
      </div>
    </section>
  );
};

export default DefaultSection;
