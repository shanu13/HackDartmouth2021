
const deletePost = document.querySelectorAll('#deletePost')

deletePost.forEach(post => post.addEventListener('click',(e)=> {
    console.log('clicked');
    let url = `http://localhost:3000/delete/${post.dataset.postid}`
    console.log(url)

    fetch(url,{
        method : 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        window.location.href = data.redirect
    })
    .catch(err => console.log(err));


}))

// socket.io 

const socket = io('/');


const messagePosts = document.querySelectorAll('#message')
console.log(messagePosts)



