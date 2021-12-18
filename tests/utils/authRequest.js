import axios from "axios";

let token = null,
  refreshToken = null;

async function authReq(postData) {
  if (!token) {
    const response = await axios.post(url, {
      query: `
          mutation {
            register(username: "testuser", email: "testuser@testuser.com", password: "tester") {
              ok
              errors {
                path
                message
              }
              user {
                username
                email
              }
            }
          }
          `,
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: "testuser",
            email: "testuser@testuser.com",
          },
        },
      },
    });

    const response2 = await axios.post(url, {
      query: `
          mutation {
            login(email: "testuser@testuser.com", password: "tester") {
              token
              refreshToken
            }
          }
          `,
    });

    const login = response2.data.data.login;
    token = login.token;
    refreshToken = login.refreshToken;
  }

  return axios
    .post(url, postData, {
      headers: {
        "x-token": token,
        "x-refresh-token": refreshToken,
      },
    })
    .then((res) => res)
    .catch((err) => err.response);
}

export default authReq;
