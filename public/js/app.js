const logout = async () => {
  try {
    const res = await fetcher.get("/api/user/logout");

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    location.assign("/");
  } catch (e) {
    alert.error("Error Logging Out! Please Try Again.");
  }
};
