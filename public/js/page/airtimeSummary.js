const buyAirtime = async (phone, amount) => {
  try {
    const res = await fetcher.post(`/api/transaction/buy-airtime`, {
      phone,
      amount,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Airtime Recharge Successful!");
    setTimeout(() => location.assign("/"), 2000);
  } catch (e) {
    alert.error(e.message);
  }
};

const handleAirtimeSummarySummit = async (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;
  const phone = document.querySelector("#mobileNumber").value;
  const amount = document.querySelector("#amount").value;

  await buyAirtime(phone, amount);
};

document
  .querySelector("#airtime-summary-form")
  .addEventListener("submit", handleAirtimeSummarySummit);
