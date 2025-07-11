document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const logoutBtn = document.getElementById('logoutBtn');

  if (token) {
    showLoggedIn();
  } else {
    showLoggedOut();
  }

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg_username').value;
    const password = document.getElementById('reg_password').value;

    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showLoggedIn();
    } else {
      alert(data.error);
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login_username').value;
    const password = document.getElementById('login_password').value;

    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      showLoggedIn();
    } else {
      alert(data.error);
    }
  });

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      document.getElementById('postForm').reset();
      fetchPosts();
    } else {
      alert('Lỗi khi tạo bài viết.');
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showLoggedOut();
  });
});

function showLoggedIn() {
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('createPostSection').style.display = 'block';
  document.getElementById('allPostsSection').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'block';
  fetchPosts();
}

function showLoggedOut() {
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('createPostSection').style.display = 'none';
  document.getElementById('allPostsSection').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
}

function fetchPosts() {
  fetch('/api/posts')
    .then(res => res.json())
    .then(posts => {
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = '';

      posts.forEach(post => {
        const postEl = document.createElement('div');
        postEl.className = 'post';
        postEl.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><em>Post by: ${post.username}</em></p>
          <button onclick="deletePost(${post.id})">Delete</button>
        `;
        postsDiv.appendChild(postEl);
      });
    });
}

function deletePost(id) {
  fetch(`/api/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(res => {
    if (res.ok) {
      fetchPosts();
    } else {
      alert('Xoá thất bại');
    }
  });
}

