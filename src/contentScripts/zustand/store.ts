import { create } from "zustand";
import { fileTypeItems, languages, models } from "@src/config/ocrParamsConfig";

interface OcrState {
    model: string;
    language: string;
    fileType: string;
    openOcrOutputModal: boolean;
    screenshot: File | null;
    ocrStatus: 0 | 1 | 2;
    resultInputValue: string;
    taskId: string | null;

    setModel: (payload: string) => void;
    setLanguage: (payload: string) => void;
    setFileType: (payload: string) => void;
    setOpenOcrOutputModal: (payload: boolean) => void;
    setScreenshot: (payload: File | null) => void;
    setOcrStatus: (payload: 0 | 1 | 2) => void;
    setResultInputValue: (payload: string) => void;
    setTaskId: (payload: string | null) => void;
    onCancelOcr: () => void;
}

export const useOcrStore = create<OcrState>((set) => ({
    model: models[0].value,
    language: languages[1].value,
    fileType: fileTypeItems[1].value,
    openOcrOutputModal: false,
    screenshot: null,
    ocrStatus: 0,
    resultInputValue: "",
    taskId: null,

    setModel: (payload) => set((state) => ({ ...state, model: payload })),
    setLanguage: (payload) => set((state) => ({ ...state, language: payload })),
    setFileType: (payload) => set((state) => ({ ...state, fileType: payload })),
    setOpenOcrOutputModal: (payload) => set((state) => ({ ...state, openOcrOutputModal: payload })),
    setScreenshot: (payload) =>
        set((state) => ({
            ...state,
            screenshot: payload,
            openOcrOutputModal: true,
        })),
    setOcrStatus: (payload) => set((state) => ({ ...state, ocrStatus: payload })),
    setResultInputValue: (payload) => set((state) => ({ ...state, resultInputValue: payload })),
    setTaskId: (payload) => set((state) => ({ ...state, taskId: payload })),
    onCancelOcr: () =>
        set((state) => ({
            ...state,
            taskId: null,
            ocrStatus: 0,
            screenshot: null,
            openOcrOutputModal: false,
        })),
}));
