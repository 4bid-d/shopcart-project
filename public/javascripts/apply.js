
// function sendDeleteRequest(objectId) {

//   function deleteconfirmation() {

//     const confirmationText = "Are you sure to delete this item"

//     if (confirm(confirmationText) == true) {
//       window.location.href = `/admin/delete/${objectId}`

//     }

//   }
//   //function for delete a product after asking user top confirm
//   deleteconfirmation()
// }


// Converting JSON data to string
var data = JSON.stringify({ "id": objectId, });
console.log(data)
// Sending data with the request
xhr.send(data);

function fetchData(id) {
  const input = document.querySelector("#form1")

  // let result = document.getElementById(objectId);
  // let name = document.querySelector('#name');
  // let email = document.querySelector('#email');
  console.log(objectId)
  // Creating a XHR object
  let xhr = new XMLHttpRequest();
  let url = `quantity/${id}/${input.value}`;

  // open a connection
  xhr.open("GET", url, true);

  // Set the request header i.e. which type of content you are sending
  xhr.setRequestHeader("Content-Type", "application/json");

  // Create a state change callback
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {

      // Print received data from server
      result.innerHTML = this.responseText;

    }
  };

}