import { create } from "zustand";
import { fileTypeItems, languages, models } from "@src/config/ocrParamsConfig";

interface OcrState {
    orcLoading: boolean;
    ocrInputValue: string;
    model: string;
    language: string;
    fileType: string;
    openOcrOutputModal: boolean;
    screenshot: File | null;
    ocrStatus: 0 | 1 | 2;
    taskId: string | null;
    callId: string | null;

    setOrcLoading: (payload: boolean) => void;
    setOcrInputValue: (payload: string) => void;
    setModel: (payload: string) => void;
    setLanguage: (payload: string) => void;
    setFileType: (payload: string) => void;
    setOpenOcrOutputModal: (payload: boolean) => void;
    setScreenshot: (payload: File | null) => void;
    setOcrStatus: (payload: 0 | 1 | 2) => void;
    setTaskId: (payload: string | null) => void;
    onCancelOcr: () => void;
}

export const useOcrStore = create<OcrState>((set) => ({
    orcLoading: false,
    ocrInputValue: "",
    model: models[0].value,
    language: languages[1].value,
    fileType: fileTypeItems[1].value,
    openOcrOutputModal: false,
    screenshot: null,
    ocrStatus: 0,
    taskId: null,
    callId: null,

    setOrcLoading: (payload) => set((state) => ({ ...state, orcLoading: payload })),
    setOcrInputValue: (payload) => set((state) => ({ ...state, ocrInputValue: payload })),
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
