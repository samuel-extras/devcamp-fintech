const subscribe = async (cable, plan, number) => {
  try {
    const res = await fetcher.post(`/api/transaction/pay-cable-tv`, {
      cable,
      plan,
      number,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Cable Subscription Successful!");
    setTimeout(() => location.assign("/"), 2000);
  } catch (e) {
    alert.error(e.message);
  }
};

const handleCableSummarySummit = async (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const cable = document.querySelector("#cable").value;
  const plan = document.querySelector("#plan").value;
  const number = document.querySelector("#number").value;

  await subscribe(cable, plan, number);
};

document
  .querySelector("#cable-summary-form")
  .addEventListener("submit", handleCableSummarySummit);
