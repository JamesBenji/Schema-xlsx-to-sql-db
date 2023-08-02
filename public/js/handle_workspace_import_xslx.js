document.addEventListener("DOMContentLoaded",() => {

    const upload_input = document.getElementById('xlsx-upload');
    const form = document.getElementById('xlsx_upload_form');
    const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
    const upload_msg = document.getElementById('upload-status-show');
    const closeIcon = document.querySelector('.upload-status #close');
    // const submitbtn = document.getElementById('submit-selected-file');
    
    
    const sendFiles = async () => {
        const files = upload_input.files;
        console.log(files);

        const formData = new FormData();

        Object.keys(files).forEach(key => {
            formData.append(`${files.item(key).name}`, files.item(key));
        });

        function closedis(){
            const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
            upload_div.style.display = 'none';
        }
    
        function showdis(){
            const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
            upload_div.style.display = 'grid';
        }

        const response = await fetch('http://localhost:4000/api/uploadXLSX',{
            method: "POST",
            body: formData,
        } )
        .then(res => res.json())
        .then(data => {

            if(data.hasOwnProperty('error')){
                showdis();
                upload_msg.innerHTML = `
                    <div class=''>
                    <ion-icon name="close" id="close" onclick="closedis()"></ion-icon><br>
                        <div id="upload-error"></div>
                    </div>
                    `;

                const errorDis = document.getElementById('upload-error');
                errorDis.innerHTML = `<h3>${data.error}</h3>`;

            } else {
                // data[`${Object.keys(data)[0]}`]
                showdis();
                data.success.forEach(doc => {
                    upload_msg.innerHTML = `
                    <div class=''>
                    <ion-icon name="close" id="close" onclick="closedis()"></ion-icon><br>
                    <b>${doc.file_name} uploaded and ready for storage in the database</b><br>
                    <button class='action-save' id="btn-for-${doc.file_name}" data-forFile="${doc.file_name}" onclick="getTableName('${doc.file_name}');">Save in database</button>
                    
                    </div>
                    `;
                });
    
                // upload_div.style.display = 'grid';
            }

        });

    };

    form.addEventListener('submit', (e) => {
        // log file list
        e.preventDefault();
        sendFiles();
    });

})



const getTableName = async (file) => {    
    const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
    const upload_msg = document.getElementById('upload-status-show');

    function closedis(){
        const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
        upload_div.style.display = 'none';
    }

    function showdis(){
        const upload_div = Array.from(document.getElementsByClassName('upload-status'))[0];
        upload_div.style.display = 'grid';
    }

    let format1 = file.split(".")[0]
    let format2 = format1.split(' ').join('');
    let tableName = window.prompt("Please enter the table name", format2);
    if (tableName === null) {
        alert("Action canceled.");
      } else if (tableName.trim() === "") {
        alert("Please provide a response.");
      } else if (tableName.split(' ').length > 1){
        alert("The table name provided has spaces. Please enter a table name without spaces.")
      }
      else {
        alert("Action confirmed!");
            if(tableName && tableName.length > 0) {
                closedis();
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

                if(data.hasOwnProperty("error")){
                    showdis();
                    upload_msg.innerHTML = `
                    <div class=''>
                    <ion-icon name="close" id="close" onclick="closedis()"></ion-icon><br>
                        <div class='error-display' id='error-display'>

                        </div>

                        <div class='troubleshoot' id='troubleshoot'></div>
                    </div>
                    `;

                    const errorDisplay = document.getElementById('error-display');
                    const troubleshoot = document.getElementById('troubleshoot');
                    data.error.forEach(error => {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = `${error.error} \nSolution: ${error?.solve}`;
                        // troubleshoot.innerHTML = `<h3>${error?.solve}</h3>`
                        errorDisplay.appendChild(paragraph);
                    });




                }
                else{
                    window.location.replace("/workspace/open-file")

                }
            });
            } 

      }
    console.log(tableName);

    
}
