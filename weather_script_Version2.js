const params = getParams($argument);
const cityId = params.cityId || "101251101";
const apiUrl = `http://t.weather.sojson.com/api/weather/city/${cityId}`;

$httpClient.get(apiUrl, (error, response, data) => {
  if (error) {
    console.log(error);
    $done();
    return;
  }

  let weatherData;
  try {
    weatherData = JSON.parse(data);
  } catch (e) {
    console.log("JSON parse error:", e);
    $done();
    return;
  }

  if (weatherData.status !== 200) {
    console.log(`请求失败，状态码：${weatherData.status}`);
    $done();
    return;
  }

  const cityInfo = weatherData.cityInfo;
  const currentWeather = weatherData.data.forecast[0];
  const message = `📍城市：${cityInfo.city}
🕰︎更新时间：${cityInfo.updateTime}
🌤︎天气：${currentWeather.type}
🌡︎温度：${currentWeather.low}  ${currentWeather.high}
💧湿度：${weatherData.data.shidu}
💨空气质量：${weatherData.data.quality}
☁️PM2.5：${weatherData.data.pm25}
☁️PM10：${weatherData.data.pm10}
🪁风向：${currentWeather.fx}
🌪️风力：${currentWeather.fl}
🌅日出时间：${currentWeather.sunrise}
🌇日落时间：${currentWeather.sunset}
🏷︎Tips：${currentWeather.notice}`;

  const body = {
    title: "今日天气",
    content: message,
    cityId: params.cityId,
    icon: params.icon || "cloud.sun", // default icon if not provided
    "icon-color": params.color || "#FFA500" // default color if not provided
  };
  $done(body);
});

function getParams(param) {
  if (!param) return {};
  return Object.fromEntries(
    param
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v || "")])
  );
}