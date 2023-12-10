const setLocalStorage = async (key, value) => {
  try {
    await localStorage.setItem(key, value);
  } catch (error) {
    console.log("Set async storage error", error);
  }
};

const getLocalStorage = async (key) => {
  try {
    return await localStorage.getItem(key);
  } catch (error) {
    console.log("Get async storage error", error);
  }
};

export { setLocalStorage, getLocalStorage };
