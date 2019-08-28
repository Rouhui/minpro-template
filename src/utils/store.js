// 每个 state 对应的数据
let stateMap = {};

function set(state, data) {
  stateMap[state] = data;
}

function get(state) {
  if (state) {
    return stateMap[state]
  } else {
    const viewHistory = getCurrentPages();
    const currentState = viewHistory && viewHistory[viewHistory.length - 1].route;
    return stateMap[currentState];
  }
}

// 清空 store
function clear() {
  stateMap = {}
}

export default {
  set,
  get,
  clear
};