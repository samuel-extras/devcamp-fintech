const buyData = async (phone, plan) => {
  try {
    const res = await fetcher.post(`/api/transaction/buy-data`, {
      phone,
      plan,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Data Bundle Purchase Successful!");
    setTimeout(() => location.assign("/"), 2000);
  } catch (e) {
    alert.error(e.message);
  }
};

const handleDataSummarySummit = async (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const phone = document.querySelector("#mobileNumber").value;
  const plan = document.querySelector("#plan").value;

  await buyData(phone, plan);
};

document
  .querySelector("#data-summary-form")
  .addEventListener("submit", handleDataSummarySummit);
