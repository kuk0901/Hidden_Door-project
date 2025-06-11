const ReservationThemeSection = ({
  selectedTheme,
  setSelectedTheme,
  themes,
}) => {
  return (
    <div className="theme-section">
      <h2 className="section-title">테마 선택</h2>
      <div className="theme-slots">
        {themes.map((theme) => (
          <button
            key={theme.themeId}
            type="button"
            onClick={() => setSelectedTheme(theme.themeId)}
            className={`theme-slot ${
              selectedTheme === theme.themeId ? "selected" : ""
            }`}
          >
            {theme.themeName || "테마 이름 없음"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReservationThemeSection;
