const storage_key = 'STORAGE_KEY';
const submit_book_data = document.getElementById('input_book');
const search_book_data = document.getElementById('search_book');

function check_for_storage() {
    return typeof (Storage) !== 'undefined';
}

function add_book_data(data) {
    if (check_for_storage()) {
      let book_data = [];

      if (localStorage.getItem(storage_key) !== null) {
        book_data = JSON.parse(localStorage.getItem(storage_key));
      }

      book_data.unshift(data);

      localStorage.setItem(storage_key, JSON.stringify(book_data));
    }
}

function delete_book_data(delete_id){
    if (check_for_storage()) { 
        let book_data = [];
        if (localStorage.getItem(storage_key) !== null) {
            book_data = JSON.parse(localStorage.getItem(storage_key));
        }

        const index = book_data.findIndex(item => item.id == delete_id)
        book_data.splice(index, 1);
        localStorage.setItem(storage_key, JSON.stringify(book_data));
    }
}

function move_book_data(move_id){
    if (check_for_storage()) { 
        let book_data = [];
        if (localStorage.getItem(storage_key) !== null) {
            book_data = JSON.parse(localStorage.getItem(storage_key));
            const index = book_data.findIndex(item => item.id == move_id);

            if (book_data[index].iscomplete == true){
                book_data[index].iscomplete = false;
            }
            else{
                book_data[index].iscomplete = true;
            }
            localStorage.setItem(storage_key, JSON.stringify(book_data));
        }
    }
}

function get_book_data() {
    if (check_for_storage()) {
        return JSON.parse(localStorage.getItem(storage_key)) || [];
    } else {
        return [];
    }
}

function render_control_button(book){
    let action_div = document.createElement('div');
    action_div.className = 'action';

    let move_button = document.createElement('button');
    move_button.id = book.id;
    move_button.className = 'move_button';    
    move_button.onclick = function(){
        move_book_data(this.id);
        render_book_list();
    };

    if (book.iscomplete !== true){
        move_button.innerHTML = 'Move to finished reading';
    }
    else{
        move_button.innerHTML = 'Move to reading list';   
    }

    let delete_button = document.createElement('button');
    delete_button.id = book.id;
    delete_button.className = 'delete_button';
    delete_button.onclick = function(){
        delete_id = this.id;
        
        const dialog = document.querySelector("dialog");
        const close_dialog_button = document.querySelector("dialog button");
        const confirm_delete_button = document.getElementById("confirm_delete")

        dialog.showModal();

        close_dialog_button.addEventListener("click", () => {
            dialog.close();
        });

        confirm_delete_button.addEventListener("click", () => {
            delete_book_data(delete_id);
            dialog.close();
            
            render_book_list();
        });
    };
    delete_button.innerHTML = 'Delete';

    action_div.appendChild(move_button);
    action_div.appendChild(delete_button);
    
    return action_div;
}



function render_book_list() {
    const book_data = get_book_data();
    const reading_list = document.querySelector('#reading_bookshelf');
    const finished_list = document.querySelector('#finished_bookshelf');
    
    reading_list.innerHTML = '';
    finished_list.innerHTML = '';

    for (let book of book_data) {
        if (book.iscomplete !== true){
            let book_item = document.createElement('article');
            let book_title = document.createElement('h3');
            let book_author = document.createElement('p');
            let book_year = document.createElement('p');
        
            book_title.innerHTML = book.title;
            book_author.innerHTML = 'Authors: '+book.author;
            book_year.innerHTML = 'Year: '+book.year;

            book_item.appendChild(book_title);
            book_item.appendChild(book_author);
            book_item.appendChild(book_year);
            book_item.id = book.id;

            reading_list.appendChild(book_item);
            
            let button_div = render_control_button(book);
            reading_list.appendChild(button_div);
            
        }
        else{
            let book_item = document.createElement('article');
            let book_title = document.createElement('h3');
            let book_author = document.createElement('p');
            let book_year = document.createElement('p');
        
            book_title.innerHTML = book.title;
            book_author.innerHTML = 'Authors: '+book.author;
            book_year.innerHTML = 'Year: '+book.year;

            book_item.appendChild(book_title);
            book_item.appendChild(book_author);
            book_item.appendChild(book_year);
            book_item.id = book.id;

            finished_list.appendChild(book_item); 
            
            let button_div = render_control_button(book);
            finished_list.appendChild(button_div);
        }
    }
    if (finished_list.innerHTML.trim() == '') {
        finished_list.innerHTML = "You haven't added any book to this shelf";
    }
    if (reading_list.innerHTML.trim() == '') {
        reading_list.innerHTML = "You haven't added any book to this shelf";
    }    
} 

submit_book_data.addEventListener('submit', function (event) {
    const input_title = document.getElementById('input_title').value;
    const input_author = document.getElementById('input_author').value;
    const input_year = document.getElementById('input_year').value;
    const input_isComplete = document.getElementById('input_isComplete').checked;
    const date = new Date();
    
    const new_book_data = {
        id: parseInt(date.getTime()),
        title: input_title,
        author: input_author,
        year: parseInt(input_year),
        iscomplete: input_isComplete,
    }
    
    add_book_data(new_book_data);
    render_book_list();
});

search_book_data.addEventListener('submit', function (event) {
    event.preventDefault();
    const search_book_title = document.getElementById('search_form').value;

    search_book(search_book_title);
});

search_book_data.addEventListener('input', function (event) {
    event.preventDefault();
    const search_book_title = document.getElementById('search_form').value;

    search_book(search_book_title);
});

function search_book(book_title){
    if (check_for_storage()) { 
        let book_data = [];
        if (localStorage.getItem(storage_key) !== null) {
            book_data = JSON.parse(localStorage.getItem(storage_key));
            if (book_data.findIndex(item => item.title == book_title) !== -1){

                const index = book_data.findIndex(item => item.title == book_title);

                document.getElementById(book_data[index].id).scrollIntoView(true);
                console.log(book_data[index].id);
            }
            localStorage.setItem(storage_key, JSON.stringify(book_data));
        }
    }
}


window.addEventListener('load', function () {
    if (check_for_storage) {
      if (localStorage.getItem(storage_key) !== null) {
        render_book_list();
      }
      else{
        const reading_list = document.querySelector('#reading_bookshelf');
        const finished_list = document.querySelector('#finished_bookshelf');
            
        reading_list.innerHTML = "You haven't added any book to this shelf";
        finished_list.innerHTML = "You haven't added any book to this shelf";
      }
    } else {
      alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
});