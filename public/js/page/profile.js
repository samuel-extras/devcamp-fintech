const updateUser = async (formData) => {
  try {
    const res = await fetcher.patch("/api/user/updateMe", formData);

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success(`Profile Updated Successfully!`);
    document.querySelector("#submitButton").disabled = false;
  } catch (e) {
    alert.error(e.message);
  }
};

const handleUserUpdate = (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const fullname = document.querySelector("#updateFullname").value;
  const email = document.querySelector("#updateEmail").value;
  const phone = document.querySelector("#updateMobile").value;
  updateUser({ fullname, email, phone });
};

document
  .querySelector("#personalInformation")
  .addEventListener("submit", handleUserUpdate);
