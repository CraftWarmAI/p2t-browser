const store: RecommendKeywordStore = {
    list: [],
    loading: true,
    faulting: false,
    rankOvertime: false,
};

function amazonReducer(state = store, action: any) {
    switch (action.type) {
        case "SET_RECOMMENDEDKEYWORD": {
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
