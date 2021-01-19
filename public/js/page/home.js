const getRangeOfValidAmount = (min, max) => `(${min} - ${max.toLocaleString()})`

const initializeValues = ({ operator, min, max, rate }) => {
    document.querySelector("#mobileNetwork").value = operator;
    document.querySelector("#mobileNetwork").readOnly = true;

    document.querySelector("#rangeOfValidAmount").innerText = getRangeOfValidAmount(min, max);
    document.querySelector("#airtime-amount").min = min
    document.querySelector("#airtime-amount").max = max
    document.querySelector("#networkChargeRate").value = rate
    document.querySelector("#buy-airtime-submit").disabled = false;
}

const getMobileNetwork = async (e) => {
    e.preventDefault()
    const mobile = e.target.value;
    const eMssg = "Unable to Get Mobile Operator. Please try again";
    try {
        const res = await fetcher.get(`/api/transaction/get-mobile-network?mobile=${mobile}`);

        if (res.status === "fail" || res.status === "error")
        return alert.error(eMssg);
        initializeValues({ mobile, ...res.data })
  } catch (e) {
    alert.error(eMssg);
  }
}

document.querySelector("#mobileNumber").addEventListener("focusout", getMobileNetwork)