import { db, auth } from './firebase.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

let bannerPath;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get the blog ID from the URL
let blogId = new URLSearchParams(window.location.search).get('id');
console.log('Blog ID:', blogId);

async function getExistingBlog() {
    if (!blogId) {
        console.log('No blog ID found, ready for new post');
        return;
    }

    try {
        const docRef = doc(db, "blogs", blogId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Existing blog found, populating fields');
            let data = docSnap.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;
        } else {
            console.log('Blog not found, redirecting');
            location.replace("/");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getExistingBlog();
});

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if(file && file.type.includes("image")){
        const formdata = new FormData();
        formdata.append('image', file);

        fetch('/upload', {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        .then(data => {
            if(uploadType == "image"){
                addImage(data, file.name);
            } else{
                bannerPath = `${location.origin}/${data}`;
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        })
    } else{
        alert("upload Image only");
    }
}

const addImage = (imagepath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}

publishBtn.addEventListener('click', async () => {
    if(articleField.value.length && blogTitleField.value.length){
        console.log('Publishing blog. Blog ID:', blogId);
        let date = new Date();
        
        try {
            // Check if the user is authenticated
            if (!auth.currentUser) {
                throw new Error('User not authenticated');
            }

            const blogData = {
                title: blogTitleField.value,
                article: articleField.value,
                bannerImage: bannerPath,
                publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
                author: auth.currentUser.email.split('@')[0],
                authorId: auth.currentUser.uid,
            };

            if(blogId) {
                console.log('Updating existing blog');
                await updateDoc(doc(db, "blogs", blogId), blogData);
            } else {
                console.log('Creating new blog');
                const docRef = await addDoc(collection(db, "blogs"), blogData);
                blogId = docRef.id;
            }
            console.log('Blog published successfully. Redirecting to:', `/blog?id=${blogId}`);
            location.href = `/blog?id=${blogId}`;
        } catch (err) {
            console.error('Error publishing blog:', err);
            alert('Error publishing blog: ' + err.message);
        }
    } else {
        alert('Please fill in both the title and article fields');
    }
});