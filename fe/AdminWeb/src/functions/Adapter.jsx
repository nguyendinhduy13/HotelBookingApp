const moneyAdapter = (money, type, req) => {
  var m = 0;
  if (type === "VND") {
    m = money.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  } else if (type === "USD") {
    m = (money / 23000).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  if (req === "chart") {
    if (type === "VND") m = (money / 1000000).toFixed(2) + "M";
    else if (type === "USD") m = "$" + (money / 23000 / 1000).toFixed(2) + "K";
    return m;
  }
  return m.split(".")[1] === "00" ? m.split(".")[0] : m;
};


const formatDate = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const paymentAdapter = (method) => {
  if (method === "payment-hotel") {
    return "At hotel";
  } else if (method === "payment-momo") {
    return "Momo";
  } else if (method === "payment-zalopay") {
    return "ZaloPay";
  } else return "Null";
};

export { moneyAdapter, paymentAdapter,formatDate };
