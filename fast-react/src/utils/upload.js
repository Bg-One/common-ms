import {uploadsApi} from "../common/api/sys/common";

export const paseImageFile = async () => {
    event.preventDefault();
    event.stopPropagation();
    let needItem = await navigator.clipboard.read();
    let needData = needItem[0]
    for (const t of needData.types) {
        if (t.indexOf('image') !== -1) {
            let blob = await needData.getType(t);
            const formData = new FormData();
            formData.append('files', blob, blob.name || 'pasted_image.png');
            let res = await uploadsApi(formData)
            return res
        }
    }
}
