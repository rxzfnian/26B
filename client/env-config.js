// 环境配置文件
// 部署时请修改下面的地址

const config = {
  development: {
    API_URL: 'http://localhost:8080/api'
  },
  production: {
    // 默认的生产环境后端地址（可以被环境变量覆盖）
    API_URL: 'https://unknown-ali-fpx2019-fd4b188c.koyeb.app/api'
  }
};

// 根据环境选择配置
const env = process.env.NODE_ENV || 'development';
const currentConfig = config[env];

// 优先使用部署环境提供的变量 REACT_APP_API_URL，其次回退到默认配置
const injectedApiUrl = process.env.REACT_APP_API_URL;
const resolvedApiUrl = injectedApiUrl && injectedApiUrl.trim() !== ''
  ? injectedApiUrl.trim()
  : currentConfig.API_URL;

console.log(`🌍 当前环境: ${env}`);
console.log(`🔗 API地址: ${resolvedApiUrl}`);

module.exports = { API_URL: resolvedApiUrl };
