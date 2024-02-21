// Fonction pour mettre à jour le tableau
function updateTable(data) {
  var table = $("#personTable");
  table.empty(); // Efface le contenu précédent du tableau

  // Crée un en-tête pour le tableau
  table.append("<thead><tr><th>Nom</th><th>Prénom</th><th>Âge</th><th>Profession</th><th>Action</th></tr></thead>");
  // Remplit le tableau avec les données reçues
  var tbody = $("<tbody></tbody>");
  data.forEach(function(person) {
    //var row = "<tr><td>" + person.nom + "</td><td>" + person.prenom + "</td><td>" + person.age + "</td><td>" + person.profession + "</td><td>" + "<button id='delete'>Delete</button>" + "</td></tr>";
    var row = "<tr><td>" + person.nom + "</td><td>" + person.prenom + "</td><td>" + person.age + "</td><td>" + person.profession + "</td><td>" + "<button class='delete-button' data-person-id='" + person.id + "'>Delete</button>" + "</td></tr>";
    tbody.append(row);
  });

  table.append(tbody);
}

// click to delete
$(document).on("click", ".delete-button", function() {
  var personId = $(this).data("person-id");

  $.ajax({
    type: "DELETE",
    url: "http://backend:8080/api/persons/" + personId, // Replace with the actual API endpoint for deleting a person
    success: function(data) {
      // The person was successfully deleted, you can update the table or perform other actions if needed.
      // For example, you can remove the row from the table.
      //$(this).closest("tr").remove();

      // Afficher le message de success
      var errorAlertHtml = '<div class="alert alert-success alert-dismissible fade show" role="alert">';
      errorAlertHtml += data.message;
      errorAlertHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
      errorAlertHtml += '<span aria-hidden="true">&times;</span>';
      errorAlertHtml += '</button>';
      errorAlertHtml += '</div>';
      console.log(data.message)

      // Ajoutez l'alerte au conteneur que vous souhaitez afficher (par exemple, un div avec un ID spécifique).
      $("#alert-error").html(errorAlertHtml);

      // Utilisez setTimeout pour faire disparaître l'alerte après 5 secondes
      setTimeout(function() {
        $(".alert").alert('close');
      }, 5000);

      // Faites une requête GET sur l'URL http://backend:8080/api/persons
      fetch('http://backend:8080/api/persons')
      .then(response => {
        if (!response.ok) {
          throw new Error('La requête a échoué');
        }
        return response.json(); // Convertit la réponse en JSON
      })
      .then(data => {
        // Les données sont stockées dans la variable "data"
        console.log(data);
        // Faites ce que vous voulez avec les données ici
        updateTable(data);
      })
      .catch(error => {
        // Gérer les erreurs ici
        console.error('Erreur :', error);
      });
    },
    error: function(error) {
      // Handle errors if the DELETE request fails.
      console.error('Error:', error);
    }
  });
});

// Gère la soumission du formulaire
$("#personForm").submit(function(event) {
  event.preventDefault();

  var formData = {
    nom: $("#nom").val(),
    prenom: $("#prenom").val(),
    age: $("#age").val(),
    profession: $("#profession").val()
  };

  $.ajax({
    type: "POST",
    url: "http://backend:8080/api/persons",
    timeout: 5000,
    data: JSON.stringify(formData),
    contentType: "application/json",
    success: function(data) {
      // Afficher le message de success
      var errorAlertHtml = '<div class="alert alert-success alert-dismissible fade show" role="alert">';
      errorAlertHtml += data.message;
      errorAlertHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
      errorAlertHtml += '<span aria-hidden="true">&times;</span>';
      errorAlertHtml += '</button>';
      errorAlertHtml += '</div>';
      console.log(data.message)

      // Ajoutez l'alerte au conteneur que vous souhaitez afficher (par exemple, un div avec un ID spécifique).
      $("#alert-error").html(errorAlertHtml);

      // Utilisez setTimeout pour faire disparaître l'alerte après 5 secondes
      setTimeout(function() {
        $(".alert").alert('close');
      }, 5000);
      
      //update database
      // Faites une requête GET sur l'URL http://backend:8080/api/persons
      fetch('http://backend:8080/api/persons')
      .then(response => {
        if (!response.ok) {
          throw new Error('La requête a échoué');
        }
        return response.json(); // Convertit la réponse en JSON
      })
      .then(data => {
        // Les données sont stockées dans la variable "data"
        console.log(data);
        // Faites ce que vous voulez avec les données ici
        updateTable(data);
      })
      .catch(error => {
        // Gérer les erreurs ici
        console.error('Erreur :', error);
      });

      // Efface les champs du formulaire
      $("#nom").val("");
      $("#prenom").val("");
      $("#age").val("");
      $("#profession").val("");
    },
    error: function(error) {
      // Gérer les erreurs ici
      var errorAlertHtml = '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
      errorAlertHtml += 'La requête a échoué. Veuillez réessayer plus tard.';
      errorAlertHtml += '<button type="button" class="close" data-dismiss="alert" aria-label="Close">';
      errorAlertHtml += '<span aria-hidden="true">&times;</span>';
      errorAlertHtml += '</button>';
      errorAlertHtml += '</div>';

      // Ajoutez l'alerte au conteneur que vous souhaitez afficher (par exemple, un div avec un ID spécifique).
      $("#alert-error").html(errorAlertHtml);

      // Utilisez setTimeout pour faire disparaître l'alerte après 5 secondes
      setTimeout(function() {
        $(".alert").alert('close');
      }, 5000);
    }
  });
});

// Appel GET initial pour peupler le tableau
$.ajax({
  type: "GET",
  url: "http://backend:8080/api/persons",
  timeout: 2000,
  success: function(data) {
    console.log(data)
    updateTable(data);
  },
  error: function(error) {
    // Gérer les erreurs ici
    console.log('error no table')
    var errorHtml = '<div class="alert alert-danger" role="alert">';
    errorHtml += 'ERROR: connexion à l\'API à échoué.';
    errorHtml += '</div>';
    $("#errorAPI").html(errorHtml); // Remplacez "votreDivOuElement" par l'ID de l'élément où vous voulez afficher l'erreur.
  }
});
