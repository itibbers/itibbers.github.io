$(function() {
  let 薪羽 = '<div class=\'snow\'>❅<div>'
  setInterval(() => {
    let 小可爱 = $(document).width()
    let 我 = Math.random() * 小可爱 - 100
    let 喜 = 0.3 + Math.random()
    let 欢 = 10 + Math.random() * 30
    let 你 = 我 - 100 + 200 * Math.random()
    let 呀 = 2000 + 5000 * Math.random()
    $(薪羽)
      .clone()
      .appendTo('.snowbg')
      .css({
        'left': 我 + 'px',
        'opacity': 喜,
        'font-size': 欢,
      })
      .animate({
        'top': '400px',
        'left': 你 + 'px',
        'opacity': 0.1,
      }, 呀, 'linear', function() { $(this).remove() })
  }, 200)
})
