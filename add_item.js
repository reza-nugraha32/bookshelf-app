const storage_key = 'STORAGE_KEY';
const submit_book_data = document.getElementById('input_book');

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

        const index = book_data.findIndex(item => item.id === delete_id)
        book_data.splice(index, 1);
        localStorage.setItem(storage_key, JSON.stringify(book_data));
    }
}

function move_book_data(move_id){
    if (check_for_storage()) { 
        let book_data = [];
        if (localStorage.getItem(storage_key) !== null) {
            book_data = JSON.parse(localStorage.getItem(storage_key));
            const index = book_data.findIndex(item => item.id === move_id);

            if (book_data[index].completed == true){
                book_data[index].completed = false;
            }
            else{
                book_data[index].completed = true;
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

    if (book.completed !== true){
        move_button.innerHTML = 'Move to finished reading';
    }
    else{
        move_button.innerHTML = 'Move to reading list';   
    }

    let delete_button = document.createElement('button');
    delete_button.id = book.id;
    delete_button.className = 'delete_button';
    delete_button.onclick = function(){
        delete_book_data(this.id);
        render_book_list();
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
        if (book.completed !== true){
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
            book_item.id = "Item-"+book.id;

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
            book_item.id = "Item-"+book.id;

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
    const input_is_complete = document.getElementById('input_is_complete').checked;
    const date = new Date();
    
    const new_book_data = {
        id: date.toUTCString(),
        title: input_title,
        author: input_author,
        year: input_year,
        completed: input_is_complete,
    }
    
    add_book_data(new_book_data);
    render_book_list();
});

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