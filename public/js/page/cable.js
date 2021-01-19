const form = document.querySelector("#cableTvRechargeBill");
const cableInput = document.querySelector("#cables");
const numberInput = document.querySelector("#smartCardNumber");
const planInput = document.querySelector("#plan");
const amountInput = document.querySelector("#amount");

const setCableTitle = (e) => {
  const option = [...e.target].find((option) => option.selected);
  document.querySelector("#cableTitle").value = option.getAttribute("title");
};

const setPlanAmount = (e) => {
  const option = [...e.target].find((option) => option.selected);
  amountInput.value = option.getAttribute("price");
};

const setCablePlans = ({
  primary_product_id,
  primary_product_price,
  plans,
}) => {
  planInput.innerHTML = `${plans
    .map(
      ({ plan_id, name, price }) =>
        `<option selected="${
          primary_product_id === plan_id
        }" value="${plan_id}" price="${price}">${name}</option>`
    )
    .join("")}`;
  amountInput.value = primary_product_price;
};

const initCablePlans = async (cable, number) => {
  const eMssg = "Unable to Get Cable Plans. Please try again";
  try {
    const res = await fetcher.get(
      `/api/transaction/get-cable-plans?cable=${cable}&number=${number}`
    );

    if (res.status === "fail" || res.status === "error")
      return alert.error(eMssg);
    setCablePlans(res.data);
  } catch (e) {
    alert.error(eMssg);
  }
};

const handleSmartCardFocusIn = () => {
  if (cableInput.value === "") {
    cableInput.style = "border-color: red";
    setTimeout(() => (cableInput.style = "border-color: #d5d3d3"), 1000);
  }
};

const handleSmartCardFocusOut = (e) => {
  if (numberInput.value.trim() === "") {
    numberInput.style = "border-color: red";
    setTimeout(() => (numberInput.style = "border-color: #d5d3d3"), 1000);
    return;
  }

  if (cableInput.value === "") {
    cableInput.style = "border-color: red";
    setTimeout(() => (cableInput.style = "border-color: #d5d3d3"), 1000);
    return;
  }

  initCablePlans(cableInput.value, e.target.value);
};

numberInput.addEventListener("focusin", handleSmartCardFocusIn);
numberInput.addEventListener("focusout", handleSmartCardFocusOut);
cableInput.addEventListener("change", handleSmartCardFocusOut);
cableInput.addEventListener("change", setCableTitle);
planInput.addEventListener("change", setPlanAmount);
