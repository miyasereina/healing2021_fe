// 格式化数字
const formatNumber = function(num) {
  if (num === 0) return 0;
  if (!num) return;
  if (Math.abs(num) > 100000000) {
    return Math.floor(num / 100000000) + "亿";
  } else if (Math.abs(num) > 10000) {
    return Math.floor(num / 10000) + "万";
  } else {
    return Math.floor(num);
  }
};
// 格式化视频/音乐等长度
const formatDuration = function(ms) {
  let res = "";
  let h = Math.floor(ms / 3600000) % 24;
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  if (h > 0) {
    h = h < 10 ? "0" + h : h;
    res += `${h}:`;
  }
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  res += `${m}:${s}`;
  return res;
};

// 格式化日期
const formatDate = function(value, type) {
  const date = new Date(value);
  const y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? "0" + MM : MM;
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let m = date.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = date.getSeconds();
  s = s < 10 ? "0" + s : s;
  if (type === 1) {
    return `${MM}月${d}日 ${h}:${m}`;
  } else if (type === 2) {
    return `${y}-${MM}-${d}`;
  } else if (type === 3) {
    return `${y}-${MM}-${d} ${MM}月${d}日`;
  } else if (type === 4) {
    return `${y}年${MM}月${d}日`;
  } else if (type === 5) {
    return y;
  } else if (type === 6) {
    return `${y}-${MM}-${d} ${MM}月${d}日 ${h}:${m}`;
  } else if (type===7){
    return `${y}-${MM}-${d}`
    // return `12341`
  }
};

const formatCurrentTime = function(t) {
  if (!t) return "00:00";
  let interval = Math.floor(t);
  let minute = Math.floor(interval / 60);
  let second = interval % 60;
  let m = minute < 10 ? "0" + minute : minute;
  let s = second < 10 ? "0" + second : second;
  return `${m}:${s}`;
};

export default { formatNumber, formatDuration, formatDate, formatCurrentTime };
