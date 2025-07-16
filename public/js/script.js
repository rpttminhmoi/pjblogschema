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
          <button onclick="showEditForm(${post.id}, \`${post.title}\`, \`${post.content}\`)">Sửa</button>
          <h3>Bình luận:</h3>
          <button onclick="addComment(${post.id}, document.getElementById('commentContent-${post.id}').value, document.getElementById('commentUsername-${post.id}').value)">Thêm bình luận</button>
          <form id="commentForm-${post.id}" onsubmit="event.preventDefault(); addComment(${post.id}, document.getElementById('commentContent-${post.id}').value, document.getElementById('commentUsername-${post.id}').value);">
          <input type="text" id="commentContent-${post.id}" placeholder="Nội dung bình luận" required>
          <input type="text" id="commentUsername-${post.id}" placeholder="Tên người dùng" required>
          </form>
          <div id="comments-${post.id}"></div>
          <button onclick="fetchComments(${post.id})">Tải bình luận</button>
          <script>
          fetchComments(${post.id}); // Tải bình luận ngay khi tạo post
          </script>
          
        `;
        postsDiv.appendChild(div);
      });
    });
}

function deletePost(id) {
  fetch(`/api/posts/${id}`, { method: 'DELETE' })
    .then(() => fetchPosts());
}

function showEditForm(id, oldTitle, oldContent) {
  const newTitle = prompt('Sửa tiêu đề:', oldTitle);
  if (newTitle === null) return; // Cancel

  const newContent = prompt('Sửa nội dung:', oldContent);
  if (newContent === null) return; // Cancel

  updatePost(id, newTitle.trim(), newContent.trim());
}

function updatePost(id, title, content) {
  if (!title || !content) {
    alert('Không được để trống!');
    return;
  }

  fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content })
  })
    .then(res => res.json())
    .then(() => fetchPosts())
    .catch(err => console.error(err));
}

function addComment(id, content, username) {
  if (!content || !username) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId: id, content, username })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById(`commentForm-${id}`).reset();
      fetchComments(id);
    })
    .catch(err => console.error(err));
}
function fetchComments(postId) {
  fetch(`/api/comments?postId=${postId}`)
    .then(res => res.json())
    .then(comments => {
      const commentsDiv = document.getElementById(`comments-${postId}`);
      commentsDiv.innerHTML = '';

      comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `
          <p>${comment.content}</p>
          <p><em>By: ${comment.username}</em></p>
        `;
        commentsDiv.appendChild(div);
      });
    })
    .catch(err => console.error(err));
}





