const show_use = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information

    const content = "<h1 class= 'inserted-text'>How to use</h1>"

    content_area.innerHTML = content


}

const show_view_data = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information
    const content = 
        "<div class= 'inserted-text view-data'>"+"</div>"

    content_area.innerHTML = content

}

const show_search = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information

    const content = "<h1 class= 'inserted-text'>How to use</h1>"

    content_area.innerHTML = content

}

const show_enter_data = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information

    const content = "<h1 class= 'inserted-text'>Enter Data</h1>"

    content_area.innerHTML = content

}

const show_import_sheet = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);

    
    // display the usage information

    const content = `<h1 class= 'inserted-text'>Import sheet</h1>
                    <br />
                    <form id= 'xlsx-form'>
                    <input type="file" name="xlsx_file" id="xlsx_files" multiple="multiple" accept=".xlsx" />
                    <br />
                    <button type="submit" class="upload-btn" id="upload-btn" >Upload</button>
                    </form>
                    <br />
                    `;
    content_area.innerHTML = content

    const form = document.getElementById('xlsx-form');
    
    // sendiles()
    const sendFiles = async () => {
        const files = document.getElementById('xlsx_files').files;
        console.log(files);

        const formData = new FormData();

        Object.keys(files).forEach(key => {
            formData.append(files.item(key).name, files.item(key)); // append(key, value)
        })
        // for (let i = 0; i < files.length; i++) {
        //     formData.append('xlsx_file', files[i]);
        // }
        let res_data;
        const url = '/upload';
        
        res_data = await fetch(url, {
            method: 'POST',
            body: formData
        }).then(response => response.json());

      if (res_data[0].status === 'success') {
        document.getElementById('view-data').click();
      } else {
        content_area.innerHTML = 'Failed to upload'
      }

    };



    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sendFiles();

    });

}

const show_export_to_excel = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information
    const content = "<h1 class= 'inserted-text'>Export excel</h1>"

    content_area.innerHTML = content

}

const show_recents = (id) => {
    const content_area = document.getElementById('content-area');
    const button = document.getElementById(id);
    
    // display the usage information
    const content = "<h1 class= 'inserted-text'>Recents</h1>"

    content_area.innerHTML = content

}