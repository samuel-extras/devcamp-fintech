const getDataValue = (amount) => Number(amount) > 1000 ? `${Number(amount) / 1000}GB` : `${amount}MB`;

const initializeValues = ({ operator, plans }) => {
    document.querySelector("#mobileNetwork").value = operator;
    document.querySelector("#mobileNetwork").readOnly = true;

    document.querySelector("#plans").innerHTML = `${plans.map(({ id, data_amount: da, price, validity }) => (
      `<option value="${id}" amount="${price}">${getDataValue(da)} for ₦${price} valid for ${validity}</option>`
      )).join("")}`;
    document.querySelector("#bundleAmount").value = plans[0].price;
}

const getAvailablePlans = async (e) => {
    e.preventDefault()
    const mobile = e.target.value;
    const eMssg = "Unable to Get Data Plans. Please try again";
    try {
        const res = await fetcher.get(`/api/transaction/get-available-plans?mobile=${mobile}`);

        if (res.status === "fail" || res.status === "error")
        return alert.error(eMssg);
        initializeValues({ mobile, ...res.data })
  } catch (e) {
    alert.error(eMssg);
  }
}

const handlePlanChange = (e) => {
  const option = [ ...e.target ].find(option => option.selected)
  document.querySelector("#bundleAmount").value = option.getAttribute("amount")
}

document.querySelector("#mobileNumber").addEventListener("focusout", getAvailablePlans)
document.querySelector("#plans").addEventListener("change", handlePlanChange)
