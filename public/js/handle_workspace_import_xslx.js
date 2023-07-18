document.addEventListener("DOMContentLoaded",() => {

    const dragArea = document.getElementById('drag-area');
    const upload_input = document.getElementById('xlsx-upload');
    const form = document.getElementById('xlsx_upload_form');
    const upload_div = document.getElementById('upload-status');

    dragArea.addEventListener("click", () => {
        upload_input.click();
    });

    const sendFiles = async () => {
        const files = upload_input.files;
        // console.log(files);

        const formData = new FormData();

        Object.keys(files).forEach(key => {
            formData.append(`${files.item(key).name}`, files.item(key));
        });

        const response = await fetch('http://localhost:4000/api/upload_xlsx',{
            method: "POST",
            body: formData,
        } ).then(res => res.json()).then(data => {
            if(data.hasOwnProperty('successful_uploads')) {
                data['successful_uploads'].forEach(file => {
                    upload_div.innerHTML += `<div>${file} uploaded </div><br />`

                });
            }

        });

    };

    form.addEventListener('submit', (e) => {
        // log file list
        e.preventDefault();
        sendFiles();
    });

})