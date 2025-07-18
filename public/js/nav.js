document.addEventListener('DOMContentLoaded', () => {
    let ul = document.querySelector('.links-container');
  
    if (ul) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // user is logged in
          ul.innerHTML += `
            <li class="link-item">
              <a href="/admin" class="link">Dashboard</a>
            </li>
            <li class="link-item">
              <a href="#" onclick = "logoutUser()" class="link">Logout</a>
            </li>
          `;
        } else {
          // no one is logged in
          ul.innerHTML += `
            <li class="link-item">
              <a href="/admin" class="link">Login</a>
            </li>
          `;
        }
      });
    } else {
      console.error("Element with class 'links-container' not found in the DOM.");
    }
  });