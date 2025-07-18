import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const blogsSection = document.querySelector('.blogs-section');

async function searchBlogs() {
    const searchTerm = searchInput.value.toLowerCase();
    const blogRef = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogRef);
    
    let matchingBlogs = [];

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title.toLowerCase().includes(searchTerm) || 
            data.article.toLowerCase().includes(searchTerm)) {
            matchingBlogs.push({id: doc.id, ...data});
        }
    });

    displayResults(matchingBlogs);
}

function displayResults(blogs) {
    blogsSection.innerHTML = '';
    if (blogs.length === 0) {
        blogsSection.innerHTML = '<p>No matching blogs found.</p>';
        return;
    }

    blogs.forEach((blog) => {
        const blogCard = `
            <div class="blog-card">
                <img src="${blog.bannerImage}" class="blog-image" alt="">
                <h1 class="blog-title">${blog.title.substring(0, 100) + '...'}</h1>
                <p class="blog-overview">${blog.article.substring(0, 200) + '...'}</p>
                <a href="/blog/${blog.id}" class="btn dark">read</a>
            </div>
        `;
        blogsSection.innerHTML += blogCard;
    });
}

searchButton.addEventListener('click', searchBlogs);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBlogs();
    }
});