document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const username = document.getElementById('username').value.trim();

    if (!title || !content || !username) {
      alert('Vui lòng nhập đầy đủ!');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, username })
      });

      const data = await res.json();

      if (res.ok) {
        document.getElementById('postForm').reset();
        fetchPosts();
      } else {
        alert('Tạo bài viết lỗi: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Fetch failed');
    }
  });
});

function fetchPosts() {
  fetch('/api/posts')
    .then(res => res.json())
    .then(posts => {
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = '';

      posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'post';
        div.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <p><em>By: ${post.username}</em></p>
          <button onclick="deletePost(${post.id})">Xoá</button>
        `;
        postsDiv.appendChild(div);
      });
    });
}

function deletePost(id) {
  fetch(`/api/posts/${id}`, { method: 'DELETE' })
    .then(() => fetchPosts());
}
