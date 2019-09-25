function initEvents() {
  // document.querySelector('#mark').addEventListener('click', upload, false)
  document.querySelector('.save').addEventListener('click', download, false)
  document.querySelector('.left').addEventListener('click', changeIcon.bind(null, -1), false)
  document.querySelector('.right').addEventListener('click', changeIcon.bind(null, 1), false)
  document.querySelector('#input').addEventListener('change', readFile, false)
}

// 读取
function readFile(e) {
  const file = e.target.files[0]
  if (!/image\/\w+/.test(file.type)) {
    alert("!/image\/\w+/.test(file.type)")
    return false
  }

  const reader = new FileReader()
  reader.onload = e => {
    draw(e.target.result)
  }
  reader.readAsDataURL(file)
}

// 绘制
function draw(data) {
  let img = document.querySelector('#img')
  img.src = data
}

// 下载
function download() {
  const avatar = document.querySelector('.avatar')
  const down = document.querySelector('#download')

  const rect = avatar.getBoundingClientRect()
  const base = 2
  const width = rect.width * base
  const height = rect.height * base
  const canvasBox = document.createElement("canvas")
  const scale = window.devicePixelRatio
  canvasBox.width = width * scale
  canvasBox.height = height * scale

  canvasBox.style.width = width + "px"
  canvasBox.style.height = height + "px"
  canvasBox.getContext("2d").scale(scale * base, scale * base)
  canvasBox.getContext("2d").translate(-rect.left, -rect.top)
  const opts = {
    scale: scale,
    canvas: canvasBox
  }

  html2canvas(avatar, opts).then(canvas => {
    const dataUrl = canvas.toDataURL()
    const img = document.createElement("img")
    img.src = dataUrl
    down.innerHTML = ''
    down.appendChild(img)
  })
}

// 改变图标
let n = 0

function changeIcon(d) {
  const arr = [
    './img/head1.png',
    './img/head2.png',
    './img/head3.png',
    './img/head4.png'
  ]
  const len = arr.length
  if (n + d < 0) {
    n = n + d + len
  } else {
    n = n + d
  }
  n = n % len
  const mark = document.querySelector('#mark')
  mark.src = arr[n]
}

initEvents()
