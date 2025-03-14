import { combineReducers } from "redux";
import goodsDetail from "./goodsDetail";
import goodsDetailView from "./goodsDetailView";
import recommendKeyword from "./recommendKeyword";
import similarItems from "./similarItems";

const rootReducers = combineReducers({
    goodsDetail,
    goodsDetailView,
    recommendKeyword,
    similarItems,
});

export default rootReducers;
