import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('.comment-form');
    const commentList = document.querySelector('.comment-list');
    const commentsSection = document.querySelector('.comments-section');

    // Get the blog ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (commentForm && commentList && commentsSection && blogId) {
        loadComments();

        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitComment();
        });
    } else {
        console.error('One or more comment elements are missing from the DOM or blog ID is not available');
    }

    async function submitComment() {
        const commentText = commentForm.querySelector('textarea').value.trim();
        if (!commentText) return;

        if (!auth.currentUser) {
            alert('You must be logged in to comment.');
            return;
        }

        try {
            await addDoc(collection(db, "blogs", blogId, "comments"), {
                text: commentText,
                author: auth.currentUser.displayName || auth.currentUser.email,
                createdAt: Timestamp.now(),
                userId: auth.currentUser.uid
            });

            commentForm.querySelector('textarea').value = '';
            loadComments(); // Reload comments after submitting
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    }

    async function loadComments() {
        try {
            const q = query(collection(db, "blogs", blogId, "comments"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            commentList.innerHTML = ''; // Clear existing comments

            querySnapshot.forEach((doc) => {
                const comment = doc.data();
                const commentElement = createCommentElement(comment);
                commentList.appendChild(commentElement);
            });
        } catch (error) {
            console.error("Error loading comments: ", error);
        }
    }

    function createCommentElement(comment) {
        const li = document.createElement('li');
        li.className = 'comment';
        li.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.createdAt.toDate())}</span>
            </div>
            <div class="comment-content">${comment.text}</div>
        `;
        return li;
    }

    function formatDate(date) {
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
});