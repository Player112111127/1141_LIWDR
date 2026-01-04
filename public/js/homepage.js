// ===== 漢堡選單 =====
const hamburger = document.querySelector('.hamburger'); /* 抓到漢堡按鈕元素 */
const navLinks = document.querySelector('.nav-links'); /* 抓到導覽列連結容器 */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active'); /* 點漢堡切換 class，CSS 控制展開收起 */
});

// ===== 登入/登出功能 =====
const loginNavItem = document.querySelector('#login-nav'); /* 導覽列會員登入 li */
const loggedUser = sessionStorage.getItem('username'); /* 從 sessionStorage 拿登入資訊 */

function createLoginLink() {
    const a = document.createElement('a'); /* 創建 <a> 元素 */
    a.href = '/login'; /* 設定連結路徑 */
    a.textContent = '會員登入'; /* 顯示文字 */
    a.style.color = '#7a5e3c'; /* 設定字體顏色 */
    a.style.textDecoration = 'none'; /* 去掉底線 */
    return a; /* 回傳 <a> 元素 */
}

if (loginNavItem) {
    loginNavItem.innerHTML = ''; /* 先清空 li 內容 */
    if (loggedUser) {
        loginNavItem.textContent = `歡迎 ${loggedUser}！`; /* 顯示歡迎文字 */
        loginNavItem.style.color = '#7a5e3c'; /* 字體顏色 */
        loginNavItem.style.cursor = 'pointer'; /* 滑鼠變手指 */
        loginNavItem.style.position = 'relative'; /* 方便下面絕對定位下拉選單 */

        // 登出下拉
        const dropdown = document.createElement('div'); /* 創建下拉容器 */
        dropdown.id = 'logout-dropdown'; /* 設定 id */
        dropdown.style.position = 'absolute'; /* 絕對定位相對於 li */
        dropdown.style.top = '100%'; /* 放在 li 正下方 */
        dropdown.style.left = '50%'; /* 水平置中 */
        dropdown.style.transform = 'translateX(-50%)'; /* 把自己向左移一半寬度 */
        dropdown.style.backgroundColor = '#fff'; /* 背景白色 */
        dropdown.style.border = '1px solid #ccc'; /* 邊框 */
        dropdown.style.padding = '5px 10px'; /* 內距 */
        dropdown.style.display = 'none'; /* 初始隱藏 */
        dropdown.style.whiteSpace = 'nowrap'; /* 文字不換行 */
        dropdown.style.zIndex = '1000'; /* 保證在最上層 */
        dropdown.style.marginTop = '8px'; /* 距離上方間距 */
        dropdown.style.borderRadius = '4px'; /* 圓角 */
        dropdown.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; /* 陰影效果 */

        const logoutBtn = document.createElement('button'); /* 登出按鈕 */
        logoutBtn.textContent = '登出';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.background = '#fff';
        logoutBtn.style.border = 'none';
        logoutBtn.style.fontWeight = 'bold';

        logoutBtn.addEventListener('click', () => {
            if (confirm('確定要登出嗎？')) { /* 確認視窗 */
                sessionStorage.removeItem('username'); /* 移除登入資訊 */
                loginNavItem.innerHTML = ''; /* 清空 li */
                loginNavItem.appendChild(createLoginLink()); /* 顯示登入連結 */
            }
        });

        dropdown.appendChild(logoutBtn); /* 把登出按鈕加到下拉容器 */
        loginNavItem.appendChild(dropdown); /* 下拉加到 li */

        loginNavItem.addEventListener('click', (e) => {
            e.stopPropagation(); /* 阻止事件冒泡，點 li 不觸發 document 事件 */
            dropdown.style.display =
                dropdown.style.display === 'none' ? 'block' : 'none'; /* 切換下拉顯示 */
        });

        document.addEventListener('click', (e) => {
            if (!loginNavItem.contains(e.target)) {
                dropdown.style.display = 'none'; /* 點其他地方收起 */
            }
        });

    } else {
        loginNavItem.appendChild(createLoginLink()); /* 沒登入就顯示登入連結 */
    }
}

// ===== 幻燈片資料 =====
const slidesData = [
  { title: "天然原料", text: "我們嚴選無香料的台灣茶葉與當季水果，讓每一口都喝得到真材實料。", image: "img/natural_raw_materials.jpg" },
  { title: "現點現做", text: "我們堅持每一杯都是現場手工搖製，保留茶的香氣與新鮮口感。", image: "img/Cooked_to_order.jpg" },
  { title: "永續包裝", text: "我們使用環保減塑包材，與你一起守護地球，讓美味不留下負擔。", image: "img/Sustainable_packaging.jpg" }
];

const container = document.getElementById("slide-container"); /* 幻燈片容器 */
let currentIndex = 0; /* 目前顯示的幻燈片索引 */

function animateSlide(slide, startAngle, endAngle, duration, callback) {
  const radius = 350; /* 半徑，計算圓弧動畫 */
  const centerX = radius; /* 圓心 X */
  const centerY = radius; /* 圓心 Y */
  const startTime = performance.now(); /* 取得起始時間 */

  function step(time) {
    const elapsed = time - startTime; /* 經過時間 */
    let progress = elapsed / duration; /* 進度百分比 */
    if (progress > 1) progress = 1; /* 避免超過 1 */

    const angle = startAngle + (endAngle - startAngle) * progress; /* 計算旋轉角度 */
    const x = centerX + radius * Math.cos(angle); /* X 坐標 */
    const y = centerY + radius * Math.sin(angle); /* Y 坐標 */

    const translateX = x - radius; /* 計算位移 */
    const translateY = radius - y;
    slide.style.transform = `translate(${translateX}px, ${translateY}px)`; /* CSS 移動 */

    if (progress < 1) requestAnimationFrame(step); /* 逐幀呼叫 */
    else if (callback) callback(); /* 動畫結束後呼叫回調 */
  }
  requestAnimationFrame(step); /* 開始動畫 */
}

function renderSlides() {
  container.innerHTML = ''; /* 清空 container */
  slidesData.forEach((slide, idx) => {
    const slideEl = document.createElement('div'); /* 創建幻燈片 div */
    slideEl.classList.add('slide'); /* 加 class */
    if (idx === currentIndex) {
      slideEl.classList.add('active'); /* 顯示當前 */
      slideEl.style.opacity = '1'; /* 不透明 */
      slideEl.style.transform = `translate(0px,0px)`; /* 位置 */
    } else {
      slideEl.style.opacity = '0'; /* 透明 */
      slideEl.style.transform = `translate(700px,0px)`; /* 初始偏移 */
    }
    slideEl.innerHTML = `
      <div class="slide-image" style="background-image: url('${slide.image}')"></div>
      <div class="slide-text">
        <h3>${slide.title}</h3>
        <p>${slide.text}</p>
      </div>
    `;
    container.appendChild(slideEl); /* 加入 container */
  });
}

function goToSlide(newIndex) {
  const slides = document.querySelectorAll('.slide'); /* 取得所有 slide */
  const oldSlide = slides[currentIndex]; /* 舊幻燈片 */
  const newSlide = slides[newIndex]; /* 新幻燈片 */

  oldSlide.style.pointerEvents = 'none'; /* 暫時禁止點擊 */
  newSlide.style.pointerEvents = 'none';

  const duration = 700; /* 動畫時間 ms */
  if (newIndex > currentIndex) { /* 往右切換 */
    animateSlide(oldSlide, 0, Math.PI, duration, () => {
      oldSlide.classList.remove('active'); /* 移除 class active */
      oldSlide.style.opacity = '0';
      oldSlide.style.transform = `translate(700px,0)`;
    });
    newSlide.style.opacity = '1';
    newSlide.classList.add('active');
    animateSlide(newSlide, -Math.PI, 0, duration, () => {
      newSlide.style.transform = 'translate(0,0)';
      newSlide.style.pointerEvents = 'auto';
    });
  } else { /* 往左切換 */
    animateSlide(oldSlide, Math.PI, 0, duration, () => {
      oldSlide.classList.remove('active');
      oldSlide.style.opacity = '0';
      oldSlide.style.transform = `translate(-700px,0)`;
    });
    newSlide.style.opacity = '1';
    newSlide.classList.add('active');
    animateSlide(newSlide, 0, Math.PI, duration, () => {
      newSlide.style.transform = 'translate(0,0)';
      newSlide.style.pointerEvents = 'auto';
    });
  }
  currentIndex = newIndex; /* 更新索引 */
}

document.getElementById('prevBtn').addEventListener('click', () => {
  let newIndex = currentIndex - 1; /* 往前一張 */
  if (newIndex < 0) newIndex = slidesData.length - 1; /* 循環 */
  goToSlide(newIndex);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  let newIndex = (currentIndex + 1) % slidesData.length; /* 循環下一張 */
  goToSlide(newIndex);
});

renderSlides(); /* 初始化渲染 */

// ===== 輪播幻燈片 =====
const slides = document.getElementById('slides'); /* 外層容器 */
const slideCount = slides.children.length; /* 幻燈片數量 */
const slideWidth = slides.children[0].offsetWidth + 100; /* 幻燈片寬度含間距 */
let position = 0; /* 初始位移 */

for (let i = 0; i < slideCount; i++) {
  const clone = slides.children[i].cloneNode(true); /* 複製每個幻燈片 */
  slides.appendChild(clone); /* 往後加，方便無縫循環 */
}

function moveSlide() {
  position -= slideWidth; /* 每次左移一張 */
  slides.style.transition = 'transform 0.8s ease'; /* 平滑動畫 */
  slides.style.transform = `translateX(${position}px)`;
  if (Math.abs(position) >= slideWidth * slideCount) { /* 到達尾端 */
    setTimeout(() => {
      slides.style.transition = 'none'; /* 取消動畫 */
      position = 0; /* 回到初始 */
      slides.style.transform = `translateX(${position}px)`;
    }, 750);
  }
}

setInterval(moveSlide, 3000); /* 每 3 秒切換 */

// ===== 水滴動畫 =====
const dropletsContainer = document.getElementById('floating-droplets');
const droplets = [];
const dropletCount = 10;

for (let i = 0; i < dropletCount; i++) {
  const droplet = document.createElement('div'); /* 創建水滴 */
  droplet.classList.add('droplet');
  dropletsContainer.appendChild(droplet); /* 加入容器 */
  droplets.push(droplet); /* 存進陣列方便操作 */
}

const wavePath = document.getElementById('wavePath'); /* SVG path */
const pathLength = wavePath.getTotalLength(); /* SVG 路徑長度 */
const startTimes = droplets.map(() => Math.random() * 10); /* 每個水滴起始時間隨機 */

function animateDroplets(timeStamps = 0) {
  droplets.forEach((droplet, i) => {
    let t = ((timeStamps / 1000 + startTimes[i]) % 10) / 10; /* 進度百分比 0~1 */
    let distance = pathLength * t; /* 距離 */
    let point = wavePath.getPointAtLength(distance); /* SVG path 上座標 */
    droplet.style.left = point.x + 'px';
    droplet.style.top = point.y + 'px';
  });
  requestAnimationFrame(animateDroplets); /* 逐幀動畫 */
}
animateDroplets(); /* 開始動畫 */

// ===== Tooltip =====
const tooltip = document.createElement('div'); /* 創建 tooltip 容器 */
tooltip.id = 'tooltip';
document.body.appendChild(tooltip);

document.querySelectorAll('.node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    const rect = node.getBoundingClientRect(); /* 取得元素位置 */
    tooltip.textContent = node.getAttribute('data-text'); /* 文字 */
    tooltip.style.left = (rect.left + rect.width / 2 + window.scrollX) + 'px'; /* 水平置中 */
    tooltip.style.top = (rect.top - 40 + window.scrollY) + 'px'; /* 上方 40px */
    tooltip.classList.add('visible'); /* 顯示 */
  });
  node.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible'); /* 隱藏 */
  });
});

// ===== 節點定位 =====
function positionNodes() {
  const path = document.getElementById('wavePath');
  const pathLength = path.getTotalLength();
  document.querySelectorAll('.node').forEach(node => {
    const length = parseFloat(node.dataset.length); /* 取 data-length */
    const point = path.getPointAtLength(length); /* 取得 SVG 上座標 */
    node.style.position = 'absolute';
    node.style.left = `${point.x}px`;
    node.style.top = `${point.y}px`;
  });
}

window.addEventListener('load', positionNodes); /* 載入時定位 */
window.addEventListener('resize', positionNodes); /* 視窗改變時重新定位 */
