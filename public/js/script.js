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

function fetchPosts() {
  fetch('/api/posts')
    .then(res => res.json())
    .then(posts => {
      const postsDiv = document.getElementById('posts');
      postsDiv.innerHTML = '';

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
      
      function fetchPosts() {
        fetch('/api/posts')
          .then(res => res.json())
          .then(posts => {
            const postsDiv = document.getElementById('posts');
            postsDiv.innerHTML = '';
      
            posts.forEach(post => {
              console.log("Rendering post:", post); // 🐞 debug
            
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
          });
      }
      
      function deletePost(id) {
        fetch(`/api/posts/${id}`, {
          method: 'DELETE'
        })
        .then(res => {
          if (res.ok) {
            fetchPosts();
          } else {
            alert('Xoá thất bại');
          }
        });
      }
      fetchPosts();
    });
}

function deletePost(id) {
  fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  })
  .then(res => {
    if (res.ok) {
      fetchPosts();
    } else {
      alert('Xoá thất bại');
    }
  });
}
fetchPosts();