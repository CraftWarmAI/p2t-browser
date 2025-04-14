import { Store } from "webext-redux";

export function createStore(interval = 300, counter = 0): Promise<Store> {
    return new Promise((resolve, reject) => {
        const store = new Store({
            portName: "p2t",
        });

        store.ready(() => {
            const state = store.getState();
            console.log("============= store ready =============");
            console.log(state);
            if (!state.userInfo) {
                if (counter * interval > 10 * 1000) {
                    reject(new Error("初始化store失败"));
                }
                setTimeout(() => {
                    return createStore(interval, counter + 1);
                }, interval);
            } else {
                resolve(store);
            }
        });
    });
}
