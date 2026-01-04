const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
/* 為 hamburger 元素加上「點擊事件監聽器」 */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active'); /* 切換 navLinks 的 class 'active' */
})

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
