const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
/* 為 hamburger 元素加上「點擊事件監聽器」 */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active'); /* 切換 navLinks 的 class 'active' */
})

/* 當整個網頁 (HTML + CSS + 圖片等資源) 完全載入後才執行裡面的程式 */
window.addEventListener('load', () => {
  const princess = document.getElementById('princess');
  const handShakenDrinks = document.getElementById('hand_shaken_drinks');
  const animal = document.getElementById('animal');
  const girlAndFlower = document.getElementById('girl_and_flower');
  const coffeeAroma = document.getElementById('coffee_aroma');
  const PearlMilkTea = document.getElementById('Pearl_milk_tea');
  const teapot = document.getElementById('teapot');
  const girl = document.getElementById('girl');
  const download = document.getElementById('download');
  const allMenus = document.querySelectorAll('#menu-text, #menu-text2, #menu-text3, #menu-text4, #menu-text5, #menu-text6, #menu-text7, #menu-text8, #info-block, #features, #features-2');
  /* document.querySelectorAll(...) 選取 多個元素，回傳一個 NodeList（類似陣列） */

  /* 找到虛線框元素 */
  const princessBox = document.getElementById('princess-box');
  const handShakenBox = document.getElementById('hand_shaken_drinks_box');
  const animalBox = document.getElementById('animal-box');
  const girlAndFlowerBox = document.getElementById('girl_and_flower_box');
  const coffeeAromaBox = document.getElementById('coffee_aroma_box');
  const pearlMilkTeaBox = document.getElementById('Pearl_milk_tea_box');
  const teapotBox = document.getElementById('teapot_box');
  const girlBox = document.getElementById('girl_box');
  const downloadBox = document.getElementById('download_box');

  /* setTimeout 是 JavaScript 的「延遲執行函式」 */
  setTimeout(() => {
    princess.style.opacity = 1; /* style.opacity = 1 → 完全不透明 → 完全顯示 */
    handShakenDrinks.style.opacity = 1;
    animal.style.opacity = 1;
    girlAndFlower.style.opacity = 1;
    coffeeAroma.style.opacity = 1;
    PearlMilkTea.style.opacity = 1;
    teapot.style.opacity = 1;
    girl.style.opacity = 1;
    download.style.opacity = 1;

    /* 同步淡入框線（稍微柔和一些) */
    princessBox.style.opacity = 0.6;
    handShakenBox.style.opacity = 0.6;
    animalBox.style.opacity = 0.6;
    girlAndFlowerBox.style.opacity = 0.6;
    coffeeAromaBox.style.opacity = 0.6;
    pearlMilkTeaBox.style.opacity = 0.6;
    teapotBox.style.opacity = 0.6;
    girlBox.style.opacity = 0.6;
    downloadBox.style.opacity = 0.6;
  }, 5100);
  /* 上面這段延遲器表示一開始全部隱藏 → SVG 畫完線後（5.1秒） → 圖片完全顯示，框線半透明顯示，達到「動畫完成後整個元素一起出現」的效果 */

  setTimeout(() => {
    allMenus.forEach(menu => {
      menu.style.opacity = 1;
    });
  }, 5600);

  /* allMenus 是一個 NodeList（之前抓到的：#menu-text, #menu-text2 … 等）

    .forEach() → 對 NodeList 裡的每個元素做同樣的操作

    menu → 目前正在操作的元素 */
});

const loginNavItem = document.querySelector('#login-nav'); /* 選取導覽列會員登入 li 元素 */

function renderLoginStatus() {
  if (!loginNavItem) return; /* 如果找不到導覽列元素就跳過 */

  const username = sessionStorage.getItem('username'); /* 取得 sessionStorage 的 username，分頁關閉前有效 */
  loginNavItem.innerHTML = ''; /* 清空導覽列 li 內容，避免重複渲染 */

  if (username) {
    loginNavItem.style.position = 'relative'; /* relative 讓下拉選單定位參考此元素 */
    loginNavItem.style.cursor = 'pointer'; /* 滑鼠變成手指，提示可點擊 */
    loginNavItem.style.color = '#7a5e3c';

    const userText = document.createElement('span'); /* 用 span 包用戶文字 */
    userText.textContent = `歡迎 ${username}!`; /* 顯示歡迎 + 帳號名 */
    userText.style.color = '#7a5e3c';

    const dropdown = document.createElement('div'); /* 下拉選單容器 */
    dropdown.style.position = 'absolute'; /* 絕對定位相對 loginNavItem */
    dropdown.style.top = '100%'; /* 放在文字正下方 */
    dropdown.style.left = '50%'; /* 水平置中 */
    dropdown.style.transform = 'translateX(-50%)'; /* 精準水平置中 */
    dropdown.style.marginTop = '8px';
    dropdown.style.background = '#fff';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '4px';
    dropdown.style.padding = '6px 12px';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '1000';

    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = '登出';
    logoutBtn.style.border = 'none';
    logoutBtn.style.background = 'transparent';
    logoutBtn.style.cursor = 'pointer';
    logoutBtn.style.color = '#7a5e3c';
    logoutBtn.style.fontWeight = 'bold';

    logoutBtn.addEventListener('click', (e) => {
      e.stopPropagation(); /* 阻止事件冒泡，避免 document click 收掉下拉 */
      if (confirm('確定要登出嗎？')) {
        sessionStorage.removeItem('username');
        renderLoginStatus(); /* 立刻刷新導覽列狀態 */
      }
    });

    dropdown.appendChild(logoutBtn); /* 把登出按鈕加到下拉 */
    loginNavItem.appendChild(userText); /* 把歡迎文字加進 li */
    loginNavItem.appendChild(dropdown); /* 把下拉加進 li */

    loginNavItem.addEventListener('click', (e) => {
      e.stopPropagation(); /* 防止冒泡到 document，避免收掉下拉 */
      dropdown.style.display =
        dropdown.style.display === 'none' ? 'block' : 'none'; /* 切換顯示/隱藏 */
    });

    document.addEventListener('click', () => {
      dropdown.style.display = 'none'; /* 點其他地方收掉下拉 */
    });

  } else {
    const loginLink = document.createElement('a');
    loginLink.href = '/login';
    loginLink.textContent = '會員登入';
    loginLink.style.color = '#7a5e3c';
    loginLink.style.textDecoration = 'none';

    loginNavItem.appendChild(loginLink); /* 加進 li */
  }
}

renderLoginStatus(); /* 初始化，每頁載入都會跑一次，顯示正確導覽列 */


