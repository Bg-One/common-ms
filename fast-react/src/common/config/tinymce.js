//tinymce初始化配置
export const iniOption = (selector, data, func) => {
    let url =  ip + port
    let initOption = {
        selector,//id选择器
        language: 'zh-Hans', //调用放在langs文件夹内的语言包
        branding: false, // 关闭底部官网提示 默认true
        menubar: false,//关闭菜单
        plugins: ['formatpainter', 'table', 'lists', 'fullscreen', 'image'],
        toolbar: ['formatpainter fontfamily  fontsize forecolor backcolor bold italic underline strikethrough alignleft aligncenter alignright alignjustify numlist table image fullscreen'],
        font_formats: "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
        fontsize_formats: "8pt 10pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 24pt 36pt",
        paste_data_images: true,// 默认是false的，记得要改为true才能粘贴
        powerpaste_allow_local_images: true,
        images_file_types: 'jpeg,jpg,png,gif,bmp,webp',
        images_upload_url: 'http://' + url + 'common/sendFile',//后端接口地址
        relative_urls: false,
        file_picker_types: 'image',
        automatic_uploads: false,//避免展示图片后自动上传
        image_advtab: true,
        image_uploadtab: true,
        // readonly:readonly==='false',//是否可编辑
        readonly: false,
        setup: function (editor) {
            editor.on('init', function (e) {
                editor.setContent(data);
            });
        },
        init_instance_callback: editor => { // 初始化结束后执行, 里面实现双向数据绑定功能
            editor.on('input', (e) => {
                const content = tinyMCE.activeEditor.getContent();
                func ? func(content) : ''
            });
            editor.on('paste', (e) => {
                const content = tinyMCE.activeEditor.getContent();
                func ? func(content) : ''
            });

            editor.on('ExecCommand', (e) => {
                const content = tinyMCE.activeEditor.getContent();
                func ? func(content) : ''
            });
        },
    }
    return initOption;
}
