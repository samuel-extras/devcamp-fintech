const loginUser = async (email, password) => {
  try {
    const res = await fetcher.post("/api/user/login", {
      email,
      password,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Login Successful.");
    setTimeout(() => location.assign("/"), 2000);
  } catch (e) {
    alert.error(e.message);
  }
};

const signupUser = async (formData) => {
  try {
    const res = await fetcher.post("/api/user/signup", formData);

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success(
      `Welcome ${formData.fullname}, Your Registration Was Successful.`
    );
    setTimeout(() => location.assign("/"), 3000);
  } catch (e) {
    alert.error(res.message);
  }
};

const handleLoginForm = (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;
  loginUser(email, password);
};

const handleSignupForm = (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const fullname = document.querySelector("#signupFullname").value;
  const email = document.querySelector("#signupEmail").value;
  const phone = document.querySelector("#signupMobile").value;
  const password = document.querySelector("#signupPassword").value;
  const passwordConfirm = document.querySelector("#signupConfirmPassword")
    .value;
  signupUser({ fullname, email, phone, password, passwordConfirm });
};

document
  .querySelector("#loginForm")
  .addEventListener("submit", handleLoginForm);

document
  .querySelector("#signupForm")
  .addEventListener("submit", handleSignupForm);
