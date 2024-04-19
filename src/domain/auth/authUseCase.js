const loginUri = `${import.meta.env.VITE_BLOG_API_URL}/auth/login`;

//login
// -> post username and password
// -> get username and jwt token
// -> save in local storage

export const loginUseCase = async (username, password) => {
  const response = await fetch(loginUri, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.status >= 400) {
    throw new Error("server error");
  }

  const jsonResponse = await response.json();
  return { username: jsonResponse.username, token: jsonResponse.token };
};
