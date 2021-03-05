'use strict'

var watermark = {}

var setWatermark = (str) => {
  var id = '1.23452384164.123412415'

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  var can = document.createElement('canvas')
  can.width = 500
  can.height = 300

  var cans = can.getContext('2d')
  cans.rotate(-20 * Math.PI / 200)
  cans.font = '30px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.20)'
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 5, can.height / 2)
  cans.fillText(dateFormat('YYYYmmdd', new Date()), can.width / 3, can.height / 1.5)

  var div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = '70px'
  div.style.left = '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth - 100 + 'px'
  div.style.height = document.documentElement.clientHeight - 100 + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  document.body.appendChild(div)
  return id
}

// 该方法只允许调用一次
watermark.set = (str) => {
  var id = setWatermark(str)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str)
    }
  }, 500)
  window.onresize = () => {
    setWatermark(str)
  }
}

// eslint-disable-next-line no-unused-vars
function dateFormat(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (var k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

export default watermark
