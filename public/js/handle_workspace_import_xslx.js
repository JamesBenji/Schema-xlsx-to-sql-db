document.addEventListener("DOMContentLoaded",() => {

    const dragArea = document.getElementById('drag-area');
    const upload_input = document.getElementById('xlsx-upload');
    const form = document.getElementById('xlsx_upload_form');
    const upload_div = document.getElementById('upload-status-show');
    const submitbtn = document.getElementById('submit-selected-file');
    console.log(upload_div)
    console.log(submitbtn)
    console.log(form)

    dragArea.addEventListener("click", () => {
        upload_input.click();
    });

    const sendFiles = async () => {
        const files = upload_input.files;
        console.log(files);

        const formData = new FormData();

        Object.keys(files).forEach(key => {
            formData.append(`${files.item(key).name}`, files.item(key));
        });

        const response = await fetch('http://localhost:4000/api/uploadXLSX',{
            method: "POST",
            body: formData,
        } )
        .then(res => res.json())
        .then(data => {
            // if(data.hasOwnProperty('successful_uploads')) {
            //     data['successful_uploads'].forEach(file => {
            //         upload_div.innerHTML += `<div>${file.file_name} uploaded </div><br />`

            //     });}

            console.log(data[`${Object.keys(data)[0]}`])
            console.log(data)

            data[`${Object.keys(data)[0]}`].forEach(doc => {
                upload_div.innerHTML += `
                <div class='upload-action'>
                <b>${doc.file_name} uploaded and ready for storage in the database</b>
                <button class='action-save' id="btn-for-${doc.file_name}" data-forFile="${doc.file_name}" onclick="getTableName('${doc.file_name}');">Save in database</button>
                
                </div>
                `;
            });

        });

    };

    form.addEventListener('submit', (e) => {
        // log file list
        e.preventDefault();
        sendFiles();
    });

})

const getTableName = async (file) => {
    let tableName = window.prompt("Please enter the table name", `${file.split(".")[0]}_table`);
    console.log(tableName);

    if(tableName && tableName.length > 0) {
        await fetch(`http://localhost:4000/api/create_table/${file}/${tableName}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({tableName: tableName})
    })
    .then(res => res.json())
    .then((data) =>{
        console.log(data);
    });
    } 
}
