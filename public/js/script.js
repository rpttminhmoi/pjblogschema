document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const user_id = document.getElementById('user_id').value;

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, user_id })
    });

    if (res.ok) {
      document.getElementById('postForm').reset();
      fetchPosts();
    } else {
      alert('Lỗi khi tạo bài viết');
    }
  });
});

async function fetchPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();

  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    postEl.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p><em>User ID: ${post.user_id}</em></p>
      <button onclick="deletePost(${post.id})">Delete</button>
    `;
    postsDiv.appendChild(postEl);
  });
}

async function deletePost(id) {
  const res = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    fetchPosts();
  } else {
    alert('Xoá thất bại');
  }
}
