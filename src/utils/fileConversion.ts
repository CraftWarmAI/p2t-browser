export function fileToBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function base64ToFile(base64String: string, filename: string, mimeType: string) {
    const byteCharacters = atob(base64String.split(",")[1]);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    const fileBlob = new Blob(byteArrays, { type: mimeType || "image/png" });
    return new File([fileBlob], filename, { type: mimeType || "image/png" });
}

export function blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
            resolve(reader.result); // 返回 Base64 字符串
        };
        reader.onerror = function () {
            reject(new Error("Failed to convert Blob to Base64"));
        };
        reader.readAsDataURL(blob); // 读取 Blob 为 Base64 编码的字符串
    });
}

export function base64ToBlob(base64String: string, mimeType: string) {
    const byteString = atob(base64String.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: mimeType });
}
