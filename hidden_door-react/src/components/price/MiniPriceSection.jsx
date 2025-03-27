import { useThemeList } from "@hooks/useThemeList";
import MiniPriceItem from "@components/price/MiniPriceItem";

// FIXME: useThemeList 삭제 예정
const MiniPriceSection = () => {
  const { themeList } = useThemeList();

  return (
    <section className="section section--price--mini">
      <div className="section--title text-center bold">가격</div>

      {themeList.map((theme) => (
        <MiniPriceItem key={theme.themeId} theme={theme} />
      ))}
    </section>
  );
};

export default MiniPriceSection;
