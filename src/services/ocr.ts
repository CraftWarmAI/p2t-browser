import { request } from "@src/utils/request";

function quota(body: any) {
    return request(`/api/quota`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

function imgOcr(body: any) {
    return request(`/api/pix2text`, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function imgOcrGpu(body: any) {
    return request(`/api-gpu/pix2text`, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

function getTaskResult(body: any) {
    return request("/api/result/" + body.task_id, {
        method: "GET",
        body: JSON.stringify(body),
    });
}

function getTaskResultGpu(body: any) {
    return request("/api-gpu/result/" + body.task_id, {
        method: "GET",
        body: JSON.stringify(body),
    });
}

function exportResult(body: any) {
    return request(
        `/api/result/${body.taskId}/export`,
        {
            method: "GET",
            body: JSON.stringify(body),
        },
        "blob",
    );
}

function exportResultGpu(body: any) {
    return request(
        `/api-gpu/result/${body.taskId}/export`,
        {
            method: "GET",
            body: JSON.stringify(body),
        },
        "blob",
    );
}

export default {
    quota,
    imgOcr,
    imgOcrGpu,
    getTaskResult,
    getTaskResultGpu,
    exportResult,
    exportResultGpu,
};
