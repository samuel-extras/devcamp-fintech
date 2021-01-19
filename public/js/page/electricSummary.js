const makePayment = async (product, amount, number, prepaid) => {
  try {
    const res = await fetcher.post(`/api/transaction/pay-electric-bill`, {
      product,
      amount,
      number,
      prepaid,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success("Electricity Bill Payment Successful!");
    setTimeout(() => location.assign("/profile"), 2000);
  } catch (e) {
    alert.error(e.message);
  }
};

const handleElectricSummarySummit = async (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const product = document.querySelector("#company").value;
  const amount = document.querySelector("#amount").value;
  const number = document.querySelector("#meterNo").value;
  const prepaid = document.querySelector("#meterType").value === "01" ? 1 : 0;

  await makePayment(product, amount, number, prepaid);
};

document
  .querySelector("#electric-summary-form")
  .addEventListener("submit", handleElectricSummarySummit);
