import { db, auth } from './firebase.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

let blogId = new URLSearchParams(window.location.search).get('id');

const getBlog = async () => {
    try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setupBlog(docSnap.data());
        } else{
            location.replace("/");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

getBlog();

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('title');
    const publish = document.querySelector('.published');
    
    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML += data.publishedAt;
    publish.innerHTML += `--${data.author}`;
    try{
        if (data.author == auth.currentUser.email.split('@')[0]) {
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = "inline";
            editBtn.href = `/editor?id=${blogId}`;
            console.log('Edit button set up with href:', editBtn.href);
        }
    } catch(error){
        console.error('Error setting up edit button:', error);
    }

    const article = document.querySelector('.article');
    addArticle(article, data.article);
}

const addArticle = (ele, data) => {
    data = data.split("\n").filter(item => item.length);

    data.forEach(item => {
        if(item[0] == '#'){
            let hCount = 0;
            let i = 0;
            while(item[i] == '#'){
                hCount++;
                i++;
            }
            let tag = `h${hCount}`;
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        } 
        else if(item[0] == "!" && item[1] == "["){
            let seperator;

            for(let i = 0; i <= item.length; i++){
                if(item[i] == "]" && item[i + 1] == "(" && item[item.length - 1] == ")"){
                    seperator = i;
                }
            }

            let alt = item.slice(2, seperator);
            let src = item.slice(seperator + 2, item.length - 1);
            ele.innerHTML += `
            <img src="${src}" alt="${alt}" class="article-image">
            `;
        }
        else{
            ele.innerHTML += `<p>${item}</p>`;
        }
    })
}