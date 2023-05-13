// window.onload = () => {
//     console.log("로딩되었음")
//     // loadProfile(2)
//     // loadMypage(2)
//     // handleProfileUpdate()
// }

async function handleSignup() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    // const password1 = document.getElementById("password1").value
    // const password2 = document.getElementById("password2").value
    const username = document.getElementById("username").value
    const gender = document.getElementById("gender").value
    const date_of_birth = document.getElementById("date_of_birth").value

    const response = await fetch('http://127.0.0.1:8000/user/signup/', {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password,
            "username": username,
            "gender": gender,
            "date_of_birth": date_of_birth
        })
    })

    // 회원가입 후 프로필 수정 페이지로 가입 정보를 전달하기 위해 로컬스토리지에 사용자 정보 저장
    const userInfo = {
        "email": email,
        "username": username,
        "gender": gender,
        "date_of_birth": date_of_birth,
    }

    localStorage.setItem("user-info", JSON.stringify(userInfo));

    // 회원가입 후 로그인 상태로 만들어주기(토큰을 로컬스토리지에 저장)
    const response_after_signup = await fetch("http://127.0.0.1:8000/user/login/", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })

    const response_json = await response_after_signup.json()

    localStorage.setItem("access", response_json.access)
    localStorage.setItem("refresh", response_json.refresh)

    // user-info 저장으로 필요 없어짐. 일단은 놔둠
    // const base64Url = response_json.access.split('.')[1];
    // const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    // }).join(''));

    // localStorage.setItem("payload", jsonPayload);

    window.location.href = "profile-update.html"
}

// 회원 가입 후 입력 정보를 프로필 수정 페이지로 
async function loadProfileAfterSignup() {

    const { email, username, gender, date_of_birth } = JSON.parse(localStorage.getItem("user-info"));
    localStorage.removeItem("user-info");
    console.log(email, username, gender, date_of_birth);

    const profile_email = document.getElementById("ji_profile_email");
    profile_email.innerText = email;
    const profile_username = document.getElementById("ji_profile_username");
    profile_username.setAttribute("placeholder", username);
    const profile_date_or_birth = document.getElementById("ji_profile_date_of_birth");
    profile_date_or_birth.setAttribute("placeholder", date_of_birth);
    if (gender == "F") {
        const option_female = document.getElementById("ji_option_female");
        option_female.setAttribute("selected", "selected");
    } else {
        const option_male = document.getElementById("ji_option_male");
        option_male.setAttribute("selected", "selected");
    }
}


async function handleLogin() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch("http://127.0.0.1:8000/user/login/", {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })

    const response_json = await response.json()

    localStorage.setItem("access", response_json.access)
    localStorage.setItem("refresh", response_json.refresh)

    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem("payload", jsonPayload);
    const payload_parse = JSON.parse(jsonPayload)

    console.log(payload_parse.name)
    // 로그인 완료되면 Login버튼에 payload_parse.name 넣어주기 해야함

    // 로그인 성공하면 메인페이지로 가기
    window.location.href = "#"

}

// 미완성
async function handleProfileUpdate() {
    const username = document.getElementById("ji_profile_username").value
    console.log(username)


    const response = await fetch('http://127.0.0.1:8000/user/profile/', {
        headers: {
            "content-type": "application/json",
            "Authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgzODI1Nzc0LCJpYXQiOjE2ODM3ODk3NzQsImp0aSI6ImUxZDYyZmE1NmQ2NzQ3YjQ5YThlYzgyOTg3MGY1NjM4IiwidXNlcl9pZCI6Mn0.os7pp311Fm3uQeBS_qsmrC_bdRo2b92Ss9WAXX24mUg"
        },
        method: "PUT",
        body: JSON.stringify({
            "password": "1",
            "username": username,
            "gender": "M"
        })
    })

    console.log(response)
}

async function loadProfile(user_id) {
    const response = await fetch(`http://127.0.0.1:8000/user/profile/${user_id}/`, { method: "GET" })

    response_json = await response.json()

    const profile_image = document.getElementById("profile_image");
    profile_image.setAttribute("src", `http://127.0.0.1:8000${response_json.image}`);
    const profile_username = document.getElementById("profile_username");
    const profile_followers_count = document.getElementById("profile_followers_count");
    profile_followers_count.innerText = response_json.followers_count;
    const profile_followings_count = document.getElementById("profile_followings_count");
    profile_followings_count.innerText = response_json.followings_count;
    const profile_email = document.getElementById("profile_email");
    profile_email.innerText = response_json.email;
    const profile_introduction = document.getElementById("profile_introduction");
    profile_introduction.innerText = response_json.introduction;
    const profile_gender = document.getElementById("profile_gender");
    if (response_json.gender == "F") {
        profile_gender.innerText = "여성";
    } else {
        profile_gender.innerText = "남성";
    }
    profile_username.innerText = response_json.username + "의 프로필";
    const profile_date_of_birth = document.getElementById("profile_date_of_birth");
    profile_date_of_birth.innerText = response_json.date_of_birth;
    const profile_preference = document.getElementById("profile_preference");
    profile_preference.innerText = response_json.preference;
}

async function loadMypage(user_id) {
    const response = await fetch(`http://127.0.0.1:8000/user/mypage/${user_id}/`, { method: "GET" })

    response_json = await response.json()

    const postings = document.getElementById("profile_posting")

    const profile_postings_count = document.getElementById("profile_postings_count");
    profile_postings_count.innerText = response_json.posting_set.length;
    const profile_reviews_count = document.getElementById("profile_reviews_count");
    profile_reviews_count.innerText = response_json.productreview_set.length;

    console.log(response_json.posting_set)

    response_json.posting_set.slice(0, 5).forEach(element => {
        const list = document.createElement("li")
        const new_posting = document.createElement("a")
        new_posting.setAttribute("href", "#")
        new_posting.innerText = element.title
        list.appendChild(new_posting)
        postings.appendChild(list)
    })

    const reviews = document.getElementById("profile_review")

    response_json.productreview_set.slice(0, 5).forEach(element => {
        const list = document.createElement("li")
        const new_review = document.createElement("a")
        new_review.setAttribute("href", "#")
        new_review.innerText = element.content
        list.appendChild(new_review)
        reviews.appendChild(list)

    })

}