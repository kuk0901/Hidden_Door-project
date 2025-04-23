import { useCautionList } from "@hooks/useCautionList";
import Api from "@axios/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import CautionList from "@components/caution/CautionList";
import CautionSectionSkeleton from "@components/common/loading/skeletonUI/CautionSectionSkeleton";

const CautionSection = () => {
  const { cautionList, setCautionList } = useCautionList();
  const [loading, setLoading] = useState(true);

  const getCautionList = async () => {
    try {
      const res = await Api.get("/cautions/list");

      if (res.status !== 200) {
        toast.error(
          "주의사항 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        );
        return;
      }

      setCautionList(res.data.data);
      setLoading(false);
    } catch (error) {
      toast.error(
        error.message ||
          "주의사항 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  useEffect(() => {
    if (cautionList.length === 0) {
      getCautionList();
    } else if (cautionList.length > 0) {
      setLoading(false);
    }
  }, []);

  if (loading) return <CautionSectionSkeleton />;

  return (
    <section className="section section--default section--caution">
      <div className="section--title text-center bold">주의사항</div>

      <div className="section--content">
        <CautionList />
      </div>
    </section>
  );
};

export default CautionSection;
