import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";

export default {
  plugins: [
    autoprefixer,
    postcssPresetEnv({
      stage: 1, // stage 1로 설정하여 안정적인 기능만 포함
      features: {
        "custom-properties": true, // CSS 변수를 사용할 수 있게 해줌
        "nesting-rules": true // 중첩 규칙을 사용할 수 있게 해줌
      }
    })
  ]
};
