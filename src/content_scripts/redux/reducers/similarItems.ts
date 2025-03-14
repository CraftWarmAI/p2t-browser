const store: SimilarItemsStore = {
    list: [],
    loading: true,
    faulting: false,
};

function amazonReducer(state = store, action: any) {
    switch (action.type) {
        case "SET_SIMILARITEMS": {
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
