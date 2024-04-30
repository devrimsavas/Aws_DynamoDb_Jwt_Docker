$(document).ready(function() {

    //update table 
    

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
                let row = `<tr class="dynamic-created-row">
                                <td>${item.name || ''}</td>
                                <td>${item.surname}</td> 
                                <td>${item.age}</td>
                                <td>${item.email}</td>
                           </tr>`;
                tableBody.innerHTML += row; // Append the new row to the table
            });
            //add event listener to "dynmic-created-row"
            
            const dynamicCreatedRows = document.querySelectorAll('.dynamic-created-row');


            //second method Event Delegation
            $('#database-table tbody').on('click', '.dynamic-created-row', function() {
                console.log('Row clicked');
                const $row = $(this);
                $('#name').val($row.find('td:nth-child(1)').text());
                $('#surname').val($row.find('td:nth-child(2)').text());
                $('#age').val($row.find('td:nth-child(3)').text());
                $('#email').val($row.find('td:nth-child(4)').text());
        
                //  highlight the selected row
                $('.dynamic-created-row ').removeClass('selected');           
                $row.addClass('selected');
                
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
            //update the table
            updateTable();

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

    $('#delete-button').on('click', function(e) {
        e.preventDefault();
        $('#database-entry').addClass('database-entry-selected');
        console.log("Delete button clicked");
        const email = $('#email').val();  // Make sure you have an input field for email or you're setting this value correctly
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter an email'
            });
            return;
        }
    
        // Confirm the deletion
        Swal.fire({
            title: "Are you sure you want to delete this user? " + email,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Delete operation confirmed; going to delete");

    
                fetch('/dynamodb/deleteuser', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(responseData => {
                    console.log(responseData);
                    Swal.fire(
                        'Deleted!',
                        'User has been deleted.',
                        'success'
                    );
                    //update the table
                    updateTable();
                    //clear the form
                    $('#name').val('');
                    $('#surname').val('');
                    $('#age').val('');
                    $('#email').val('');
                    

                })
                .catch(error => {
                    console.error('Error deleting data:', error);
                    Swal.fire(
                        'Failed!',
                        'Could not delete user: ' + error.message,
                        'error'
                    );
                });
            } else {
                console.log("Delete operation cancelled");
                //clear the form
                $('#name').val('');
                $('#surname').val('');
                $('#age').val('');
                $('#email').val('');
            }
        });
    }); //end delete button

    //update a person in the table

    $('#update-button').on('click',function(e) {
        e.preventDefault();
        console.log("Update button clicked");

        const email=$('#email').val();
        const name = $('#name').val();
        const surname = $('#surname').val();
        const age = $('#age').val();
        console.log(email);
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter an email Click a User on the table'
            });
            return;
        }
        //confirm deletion 
        Swal.fire({
            title: "Are you sure you want to update this user? " + name,
            icon: 'warning',
            showCancelButton:true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        }).then((result)=>{
            if (result.isConfirmed) {
                console.log("Update operation confirmed; going to update");

                //fetch to send data to server 
                fetch('/dynamodb/updateuser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:JSON.stringify({email,name,surname,age})
                })
                .then(response=> {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                        
                    }
                    return response.json();
                })
                .then(responseData=> {
                    console.log(responseData);
                    Swal.fire(
                        'Updated!',
                        'User has been updated.',
                        'success'
                    );
                    //update the table
                    updateTable();
                    //clear the form
                    $('#name').val('');
                    $('#surname').val('');
                    $('#age').val('');
                    $('#email').val('');
                })
                .catch(error=> {
                    console.error('Error updating data:', error);
                    Swal.fire(
                        'Failed!',
                        'Could not update user: ' + error.message,
                        'error'
                    );
                });
            } else {
                console.log("Update operation cancelled");
                //clear the form
                $('#name').val('');
                $('#surname').val('');
                $('#age').val('');
                $('#email').val('');
            }
        });

    }) //end update button


    


    
}); //end of document ready



    //update table 
    //actually it is already written but i am lazy to re-write it
function updateTable() {
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
        let tableBody = document.getElementById('database-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear existing table data

        // Populate table with new data
        responseData.data.forEach(item => {
            let row = `<tr class="dynamic-created-row">
                            <td>${item.name || ''}</td>
                            <td>${item.surname}</td>
                            <td>${item.age}</td>
                            <td>${item.email}</td>
                        </tr>`;
            tableBody.innerHTML += row;
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('error-message').innerText = 'Failed to load data: ' + error.message;
    });
}

