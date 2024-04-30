//backup of common.js if things get messed up :D oppps 



$(document).ready(function() {

    //get all entries
    $('#get-all-entries-button').on('click', function(e) {
        e.preventDefault();
        console.log("Get all entries button clicked");

        fetch('/dynamodb/getall', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if (!responseData || !responseData.data) {
                throw new Error('No data returned from server');
            }
            let tableBody = document.getElementById('database-table').getElementsByTagName('tbody')[0];
            if (!tableBody) {
                throw new Error('Table element not found');
            }

            // Clear existing table data
            tableBody.innerHTML = '';

            // Populate table with new data
            responseData.data.forEach(item => {
                let row = `<tr>
                                <td>${item.name || ''}</td>
                                <td>${item.surname}</td> 
                                <td>${item.age}</td>
                                <td>${item.email}</td>
                           </tr>`;
                tableBody.innerHTML += row; // Append the new row to the table
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            
            const errorMessageElement = document.getElementById('error-message');
            if (errorMessageElement) {
                errorMessageElement.innerText = 'Failed to load data: ' + error.message;
            } else {
                console.error('Error message element not found');
            }
        });
    });


    //create  a new entry 

    $('#add-button').on('click',function(e) {
        e.preventDefault();
        console.log("Add button clicked");

        let name = $('#name').val();
        let surname = $('#surname').val();
        let age = $('#age').val();
        let email = $('#email').val();


        fetch('/dynamodb/newentry', {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name,surname,age,email})
        })
        .then(response=> {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        }) 
        .then(responseData => {
            console.log(responseData);
            if (!responseData || !responseData.user) {
                throw new Error('No data returned from server');
            }
            //alert(`User added successfully: ${responseData.user.name} ${responseData.user.surname}, Age: ${responseData.user.age}, Email: ${responseData.user.email}`);
            Swal.fire( {
                icon: 'success',
                title: 'User added successfully',
                text: `${responseData.user.name} ${responseData.user.surname}, Age: ${responseData.user.age}, Email: ${responseData.user.email}`
            }

            );
        })
        .then (() => {

            //clear the form
            $('#name').val('');
            $('#surname').val('');
            $('#age').val('');
            $('#email').val('');
            

        
        })

        .catch(error => {
            console.error('Error fetching data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add user'+error.message
            });
        });

    }) //end add a new entry 


    //delete an entry 

    $('#delete-button').on('click',function(e) {
        e.preventDefault();
        console.log("Delete button clicked");
    })
}); //end of document ready

