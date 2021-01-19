const transferFund = async (to, amount) => {
  try {
    const res = await fetcher.post(`/api/transaction/transfer-fund`, {
      to,
      amount,
    });

    if (res.status === "fail" || res.status === "error")
      return alert.error(res.message);

    alert.success(`Fund Transferred to \`${to}\` Successful!`);
    setTimeout(() => location.assign("/"), 3000);
  } catch (e) {
    alert.error(e.message);
  }
};

const handleTransferSummarySummit = async (e) => {
  e.preventDefault();
  document.querySelector("#submitButton").disabled = true;

  const phone = document.querySelector("#mobileNumber").value;
  const amount = document.querySelector("#amount").value;

  await transferFund(phone, amount);
};

document
  .querySelector("#transfer-summary-form")
  .addEventListener("submit", handleTransferSummarySummit);
