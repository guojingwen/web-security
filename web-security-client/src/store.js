import { createStore } from "redux";

//定义state初始化和修改规则,reducer是一个纯函数
function loginReducer(loginInfo = {id: '', username: ''}, action) {
  switch (action.type) {
    case "doLogin":
      return action.loginInfo;
    default:
      return loginInfo;
  }
}
const store = createStore(loginReducer);

export default store;
