export function getBaseUrl() {
  let baseUrl = "";

  // 检查当前环境
  if (process.env.NODE_ENV === "development") {
    // 在开发环境下使用localhost
    // baseUrl = "http://172.10.21.42:8087";
    baseUrl = "http://43.138.41.24:8087";
  } else {
    // 在生产环境下使用不同的URL
    baseUrl = "http://43.138.41.24:8087";
  }

  return baseUrl;
}

const config = {
  apiUrl: getBaseUrl(),
};

export default config;
