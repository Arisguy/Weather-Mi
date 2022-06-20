/**
 * 和风天气相关api的封装
 */
import ApiService from "../service/index"

// 接口：获取实时天气
export const api_weather_now = (opt) => {
  return ApiService.get('/weather/now', opt)
}

// 接口：24h足小时天气预报
export const api_weather_24h = (opt) => {
  return ApiService.get('/weather/24h', opt)
}

// 接口：获取十天天气预报
export const api_weather_10d = (opt) => {
  return ApiService.get('/weather/10d', opt)
}

// 接口：获取3天天气预报
export const api_weather_3d = (opt) => {
  return ApiService.get('/weather/3d', opt)
}

// 接口：获日出日落时间
export const api_sun = (opt) => {
  return ApiService.get('/astronomy/sun', opt)
}

// 接口：分钟级降水
export const api_minutely = (opt) => {
  return ApiService.get('/minutely/5m', opt)
}

// 接口：实时空气质量
export const api_air_now = (opt) => {
  return ApiService.get('/air/now', opt)
}

// 接口：空气质量预报五天
export const api_air_5d = (opt) => {
  return ApiService.get('/air/5d', opt)
}

// 天气生活指数
export const api_indices_1d = (opt) => {
  return ApiService.get('/indices/1d', opt)
}