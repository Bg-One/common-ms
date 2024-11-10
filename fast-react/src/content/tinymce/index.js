import {useEffect} from "react";
import {iniOption} from "../../common/config/tinymce";

const TinymceEditor = ({id, data, func, height}) => {

    useEffect(() => {
        tinymce.init(iniOption("#" + id, data, func, height))
        return () => {
            destroyTinymce()
        }
    }, [])
    const destroyTinymce = () => {
        if (!window.tinymce) return
        const tinymce = window.tinymce.get(id)
        if (tinymce) {
            tinymce.destroy()
        }
    }
    return <div id={id}></div>
}
export default TinymceEditor
