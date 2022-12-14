/////////////////////////////////////////////////////////////////////
// 로그인 API 연동                                                 //
/////////////////////////////////////////////////////////////////////
// 1. #signin 클릭                                                 //
// 2. userID, #password 값 확인 (두 값이 입력되지 않았으면 return) //
// 3. 로그인 API 요청                                              //
// 3. 요청 실패시 alert message                                    //
// 4. 요청 성공시 jwt를 localstorage에 저장 후 main page 이동      //
/////////////////////////////////////////////////////////////////////

const btnSignIn = document.querySelector("#signin");

// 1번
btnSignIn.addEventListener("click", signIn);

async function signIn(event) {
    const userID   = document.querySelector("#userID").value;
    const password = document.querySelector("#password").value;


    // 2번
    if(!userID || !password) {
        return alert("정보를 정확히 입력해주세요.");

    }


    // 3번
    const signInReturn = await axios({
        method  : "post",                                   // http method
        url     :  url + "/sign-in",
        headers :  {},                                      // packet header
        data    :  {userID : userID, password : password}   // packet body

    });


    // 4번
    const isValidSignIn = signInReturn.data.code == 200;

    if(!isValidSignIn) {
        return alert("존재하지 않는 회원입니다.");

    }

    
    // 5번
    const jwt = signInReturn.data.result.jwt;
    localStorage.setItem("x-access-token", jwt);
    alert(signInReturn.data.message);

    return location.replace("./index.html");

}