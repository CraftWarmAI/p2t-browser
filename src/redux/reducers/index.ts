import { combineReducers } from "redux";
import userInfo from "./userInfo";
import ocr from "./ocr";

const rootReducers = combineReducers({ userInfo, ocr });

export default rootReducers;
