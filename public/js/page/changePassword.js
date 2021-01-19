const changePassword = async (formData) => {
  try {
    const res = await fetcher.patch("/api/user/updateMyPassword", formData);

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success(`Password Updated Successfully!`);
    document.querySelector("#submitButton").disabled = false;
  } catch (e) {
    alert.error(e.message);
  }
};

const handlePasswordChange = (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const passwordCurrent = document.querySelector("#existingPassword").value;
  const password = document.querySelector("#newPassword").value;
  const passwordConfirm = document.querySelector("#confirmPassword").value;
  changePassword({ passwordCurrent, password, passwordConfirm });
};

document
  .querySelector("#changePassword")
  .addEventListener("submit", handlePasswordChange);
