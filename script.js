// Define Super Admin credentials
const SUPER_ADMIN = {
    name: "SuperAdmin",
    email: "admin.email@gmail.com",
    username: "superadmin",
    password: "1010"
};

// Initialize user array and ensure Super Admin exists
var user = [];
var usersData = localStorage.getItem('users');
if (usersData) {
    user = JSON.parse(usersData);
}
// Add Super Admin if not present
if (!user.some(u => u.username === SUPER_ADMIN.username)) {
    user.unshift(SUPER_ADMIN);
    localStorage.setItem('users', JSON.stringify(user));
}

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
    var username = document.getElementById('regUsername').value;
    var password = document.getElementById('regPassword').value;

    if (name === '' || email === '' || username === '' || password === '') {
        alert('Unesite sve podatke');
    } else {
        var newUser = {
            name,
            email,
            username,
            password
        };
        user.push(newUser);

        localStorage.setItem('users', JSON.stringify(user));

        clearValue('regName');
        clearValue('regEmail');
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

function displayBlog() {
    var blogsData = localStorage.getItem('blogs');
    if (blogsData) {
        allBlogs = JSON.parse(blogsData);
    }

    var publishedBlogs = document.getElementById('published-blogs');
    publishedBlogs.innerHTML = '';

    allBlogs.forEach(function(blog, index) {
        var blogDiv = document.createElement('div');
        blogDiv.className = 'posted-blog';

        var title = document.createElement('div');
        title.className = 'blog-title';
        title.textContent = blog.naslov;
        blogDiv.appendChild(title);

        var content = document.createElement('div');
        content.textContent = blog.sadrzaj;
        blogDiv.appendChild(content);

        var info = document.createElement('div');
        info.innerHTML = `<small>Posted by: ${blog.author} on ${new Date(blog.postDate).toLocaleString()}</small>`;
        blogDiv.appendChild(info);

        // Show delete button only for Super Admin
        if (loggedUser && loggedUser.username === SUPER_ADMIN.username) {
            var delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.style.marginLeft = '10px';
            delBtn.onclick = function() {
                deleteBlog(index);
            };
            blogDiv.appendChild(delBtn);
        }

        publishedBlogs.appendChild(blogDiv);
    });
}

function deleteBlog(index) {
    // Only Super Admin can delete
    if (!loggedUser || loggedUser.username !== SUPER_ADMIN.username) {
        alert("Only Super Admin can delete blogs.");
        return;
    }
    allBlogs.splice(index, 1);
    localStorage.setItem('blogs', JSON.stringify(allBlogs));
    displayBlog();
}

function searchBlogs(){
    var searchFor = document.getElementById('search');
    
}

function showRegisteredUsers() {
    if (!loggedUser || loggedUser.username !== SUPER_ADMIN.username) {
        alert("Only Super Admin can view registered users.");
        return;
    }

    var container = document.getElementById('users-list-container');
    var btn = document.getElementById('toggle-users-btn');

    // Toggle visibility
    if (container.style.display === 'block' || container.innerHTML) {
        container.innerHTML = '';
        container.style.display = 'none';
        btn.textContent = 'Show Registered Users';
    } else {
        var usersData = localStorage.getItem('users');
        var usersList = usersData ? JSON.parse(usersData) : user;

        container.innerHTML = '<div id="users-list"><h3>Registered Users:</h3></div>';
        container.style.display = 'block';

        var usersListDiv = container.querySelector('#users-list');
        var ul = document.createElement('ul');
        usersList.forEach(function(u) {
            var li = document.createElement('li');
            li.textContent = `${u.name} (${u.username}, ${u.email}) `;
            if (u.username !== SUPER_ADMIN.username) {
                var delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.style.marginLeft = '10px';
                delBtn.onclick = function() {
                    deleteUser(u.username);
                };
                li.appendChild(delBtn);
            }
            ul.appendChild(li);
        });
        usersListDiv.appendChild(ul);
        btn.textContent = 'Hide Registered Users';
    }
}

function deleteUser(username) {
    var usersData = localStorage.getItem('users');
    var usersList = usersData ? JSON.parse(usersData) : user;

    // Remove user by username
    usersList = usersList.filter(u => u.username !== username);

    // Update localStorage and global user array
    localStorage.setItem('users', JSON.stringify(usersList));
    user = usersList;

    showRegisteredUsers(); // Refresh the list
}
//komentari = [{author: 'johny', text: 'Ovo je super blog', date: new Date()}]