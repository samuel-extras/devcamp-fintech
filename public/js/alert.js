const showAlert = () => {
  const TIMEOUT = 10000;
  const hide = () => {
    const element = document.querySelector(".alert");
    if (element) element.parentElement.removeChild(element);
  };

  const show = (type, message, timeout = TIMEOUT) => {
    hide();
    window.hideAlert = hide;
    const markup = `<div class="alert alert-${type} alert-dismissible" style="border-radius: 0px;margin: 0">${message}<i class="fa fa-times close" onclick="window.hideAlert()"></i></div>`;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.scrollTo(0, 0);
    window.setTimeout(hide, timeout);
  };

  return {
    success: (message, timeout) => show("success", message, timeout),
    error: (message, timeout) => show("danger", message, timeout),
    warning: (message, timeout) => show("warning", message, timeout),
    info: (message, timeout) => show("info", message, timeout),
  };
};

const alert = showAlert();
