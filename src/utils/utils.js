/*
 *过滤手机号码11位
 */
export const mobileReg = (mobile) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
  return !(reg.test(mobile))
}

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

export const priceReg = price => {
  let len = price.split('.')[0].length;
  let num = len >= 9 ? '100000000' : len >= 5 ? '10000' : '1';
  let size = len >= 9 ? '亿' : len >= 5 ? 'w' : '';
  return (price/num).toFixed(2) + size;
};
export const groupReg = (array, subGroupLength) => {
  let index = 0;
  let newArray = [];
  while(index < array.length) {
    newArray.push(array.slice(index, index += subGroupLength));
  }
  return newArray;
};

