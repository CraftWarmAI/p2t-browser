const store: goodsDetailView = {
    showBottom: false,
    href: "",
};

function amazonReducer(state = store, action: any) {
    switch (action.type) {
        case "SET_STORE": {
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
