document.addEventListener("DOMContentLoaded", () =>{
    const file_select = document.getElementById('selected-file');

    const blank_line_html = `<option value="null" data-file_id="null" style="text-align: right;">......................</option>`;

    file_select.insertAdjacentHTML('beforeend', blank_line_html);

    const getFileList = async (url) => {
            return new Promise((resolve, reject) =>{
                fetch(url)
                .then(response => {
                    if(!response.ok){ throw new Error('Error fetching data'); }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => { console.log(error); });
            });
    }


    getFileList('http://localhost:4000/api/getFileList')
    .then(data => {
        data.forEach(file => {
            if(!file.hasOwnProperty('error')){
                console.log(`${file.name} is ok`)

                const option_html = `<option value="${file.name}" data-file_id="${file.id}">${file.name}</option>`;

                file_select.insertAdjacentHTML('beforeend', option_html);
            }
        });
    })
    .catch(error => { console.log(error); });
    

    // on option select
file_select.addEventListener('change', () => {
    const selected_file = file_select.options[file_select.selectedIndex].value;

    console.log(selected_file);

    fetch('http://localhost:4000/api/show_selected_file_db_records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
         },
        body: JSON.stringify({ selected_file_name: selected_file })
    })
    .then(res => res.json())
    .then(msg => {
        document.getElementById("sys-msgs").innerHTML = `${msg}`
    })
    .catch(err => console.log(err))
})

});
