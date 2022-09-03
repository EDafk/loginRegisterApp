var user = [{
    name: 'Hamid Hamidovic',
    email: 'moj@mail.com',
    address: 'Grbavicka br12',
    username: 'hame',
    password: '1234'
}];

var loggedUser = {};
var allBlogs = [];

function isUserLogged(){
    var usersData = localStorage.getItem('loggedUser');
    if(usersData){
        login(JSON.parse(usersData));
    }
}
isUserLogged();

function login(users) {
    var email =users.email || document.getElementById('email').value;
    var username =document.getElementById('email').value;
    var password =users.password ||  document.getElementById('password').value;
    var usersData = localStorage.getItem('users');

    if(usersData){
        user = JSON.parse(usersData);
    }


    for (var useri of user) {
        if (email === useri.email || username === useri.username && password === useri.password) {
            var loginForm = document.getElementById('login-form');
            loginForm.style.display = 'none';
            var nav = document.querySelector('.nav');
            nav.style.display = 'block';
            var name = document.getElementById('user-name');
            name.innerHTML = useri.name;
            localStorage.setItem('loggedUser', JSON.stringify(email, password));
            clearValue('email');
            clearValue('password');
            loggedUser = useri;

        } else {
            var errorMSg = document.querySelector('#login-form .error-msg');
            errorMSg.style.display = 'block';
        }
    }
    displayBlog();
}

function loginOnEnter(e){
    if(e.keyCode === 13){
        console.log('user je pritisnuo enter');
        login();
    }
}

function logout() {
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';

    var nav = document.querySelector('.nav');
    nav.style.display = 'none';
    document.querySelector('#login-form .error-msg').style.display = 'none';

    localStorage.removeItem('loggedUser');
}

function signUp() {
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'none';

    var register = document.getElementById('register-form');
    register.style.display = 'block';
}

function goToLoginForm(){
    var loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';

    var register = document.getElementById('register-form');
    register.style.display = 'none';
}

function registerNow() {
    var name = document.getElementById('regName').value;
    var email = document.getElementById('regEmail').value;
    var address = document.getElementById('regAddress').value;
    var username = document.getElementById('regUsername').value;
    var password = document.getElementById('regPassword').value;

    if (name === '' || email === '' || address === '' || username === '' || password === '') {
        alert('Unesite sve podatke');
    } else {
        var newUser = {
            name,
            email,
            address,
            username,
            password
        };
        user.push(newUser);

        localStorage.setItem('users', JSON.stringify(user));

        clearValue('regName');
        clearValue('regEmail');
        clearValue('regAddress');
        clearValue('regUsername');
        clearValue('regPassword');

        goToLoginForm();

    };
};

function clearValue(id) {
    document.getElementById(id).value = '';
}


function blogPost(){
    var naslov = document.getElementById('blog-title').value;
    var sadrzaj = document.getElementById('blog-content').value;

    if(naslov === "" || sadrzaj === ""){
        return alert('Unesite sve podatke!')
    }

    var blog = {
        naslov,
        sadrzaj,
        postDate: new Date(),
        author: loggedUser.name
    };

    allBlogs.push(blog);
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    displayBlog();

    clearValue('blog-title');
    clearValue('blog-content');
    
}

function displayBlog(){
    var blogsData = localStorage.getItem('blogs');
    if(blogsData){
        allBlogs = (JSON.parse(blogsData))
    }

    var publishedBlogs = document.getElementById('published-blogs');
    publishedBlogs.innerHTML = '';

    for(var blog of allBlogs){
        var h3 = document.createElement('h3');
        h3.innerHTML = blog.naslov;
        h3.classList.add('blog-title');
        var div = document.createElement('div');
        div.classList.add('posted-blog');
        var p = document.createElement('p');
        p.innerHTML = blog.sadrzaj;
        var span = document.createElement('span');
        span.innerHTML = `Author: ${blog.author}`;
        var datum = document.createElement('i');
        datum.innerHTML = blog.postDate.toLocaleString();

        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);

        publishedBlogs.appendChild(h3);
        publishedBlogs.appendChild(div);
    }
    
}

function searchBlogs(){
    var searchFor = document.getElementById('search');
    
}

//komentari = [{author: 'johny', text: 'Ovo je super blog', date: new Date()}]