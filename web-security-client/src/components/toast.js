export default function showToast (msg) {
  const duration = msg.length * 120 + 600;
  const m = document.createElement('div');
  m.innerHTML = msg;
  m.style.cssText = "width:50%; padding: 4px 10px; box-shadow: 10px 10px 5px #888888; min-width: 180px; background: #000; opacity: 0.75; height: auto; min-height: 30px; color: #fff; line-height: 30px; text-align: center; border-radius: 4px; position: fixed; top: 20%; left: 20%; z-index: 9999;"
  document.body.appendChild(m);
  setTimeout(function() {
    const d = 0.5;
    m.style.webkitTransition = 'opacity ' + d + 's ease-in';
    m.style.opacity = '0';
    setTimeout(function() {
      document.body.removeChild(m)
    }, d * 1000);
  }, duration);
}
