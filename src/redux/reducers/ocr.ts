import { createSlice } from "@reduxjs/toolkit";
import { fileTypeItems, languages, models } from "@src/config/ocrParamsConfig";

const ocrSlice = createSlice({
    name: "ocr",
    initialState: {
        model: models[0].value,
        language: languages[1].value,
        fileType: fileTypeItems[1].value,
        openOcrOutputModal: false,
        screenshot: null,
        ocrStatus: 0, // 0-未开始 1-识别中 2-识别完成
        resultInputValue: "",
        taskId: null,
    },
    reducers: {
        SET_SCREENSHOT: (state, action) => {
            state.screenshot = action.payload;
            state.openOcrOutputModal = true;
        },
        SET_OPEN_OCR_OUTPUT_MODAL: (state, action) => {
            state.openOcrOutputModal = action.payload;
        },
        SET_MODEL: (state, action) => {
            state.model = action.payload;
        },
        SET_LANGUAGE: (state, action) => {
            state.language = action.payload;
        },
        SET_FILE_TYPE: (state, action) => {
            state.fileType = action.payload;
        },
        SET_RESULT_INPUT_VALUE: (state, action) => {
            state.resultInputValue = action.payload;
        },
        START_OCR: (state) => {
            state.ocrStatus = 1;
        },
        CANCEL_OCR: (state) => {
            state.ocrStatus = 0;
            state.screenshot = null;
            state.openOcrOutputModal = false;
        },
        RELOAD: (state, action) => {
            return action.payload;
        },
    },
});

export default ocrSlice.reducer;
