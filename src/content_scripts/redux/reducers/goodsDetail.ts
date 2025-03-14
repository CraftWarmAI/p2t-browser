const store: GoodsDetailStore = {
    asin: "",
    best_sellers_rank: [],
    title_keywords: [],
    faulting: false,
    loading: true,
    isNoData: true,
    rankOvertime: false,
};

function amazonReducer(state = store, action: any) {
    switch (action.type) {
        case "SET_GOODSDETAIL": {
            state = {
                ...state,
                ...action.data,
            };
        }
        default:
            return state;
    }
}

export default amazonReducer;
