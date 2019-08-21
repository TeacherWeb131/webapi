// RAPPELS DE COURS JS, JQUERY:

// Ci-dessous: '$(function()' fait le meme travail en jQuery que '$(document).ready(function ()...' qui fait le meme travail en jQuery
// que 'document.addEventListener('DOMContentLoaded', function ()...' en JavaScript
// Cette fonction permet d'attendre que le HTML soit totalement chargé avant d'exécuter le JS ou JQuery


// Les 2 lignes de code ci-dessous représentent la bonne pratique pour rajouter un eventListener
// la mauvaise pratique est de rajouter un eventListener dans une balise html avec l'attribut onclick
//     var ul = document.getElementById('films');
//     ul.addEventListener('click', function () {});
// });

$(function()
{
    // POUR AFFICHER CETTE APPLICATION DE CONNEXION À 'webapi' :
    // SI MON PROJET SE TROUVE SUR HTDOCS (DE MAMP), J'OUVRE LE FICHIER index.html : htdocs/webapi/client/index.html
    // Ne pas oublier de faire correspondre BASE_URl en fonction de là où se trouve le dossier 'client' dans votre projet Symfony 'webapi'
    const BASE_URL = '../web/app_dev.php/api';
    const GET_FILMS = BASE_URL + '/films';
    const GET_FILM_DETAIL = BASE_URL + '/film/';
    const DELETE_FILM = BASE_URL + '/film/';
    const POST_FILM = BASE_URL + '/film';
    const GET_ACTORS = BASE_URL + '/actors';

    // Récupérer la liste des films de la webapi (requete ajax avec $.get)
    function loadFilms()
    {
        // Ce fichier joue le role d'un client, càd qu'il va récupérer l'URL de l'appli 'webapi' (que l'on vient de créer) pour récupérer la liste des films
        // l'URL est en premier paramètre de la méthode get()
        // Le deuxième paramètre est une fonction
        $.get(GET_FILMS, function(data)
        {
            var html = "";
            for( var i = 0; i < data.length ; i++ )
            {
                html += "<li data-id='"+data[i].id+"'>"+ data[i].titre + "</li>";
            }
            $("#films #list ul").html(html);
        });
    }

    //...
    function loadActors() {
        $.get(GET_ACTORS, function (actors) {
            var html = "";
            for (var i = 0; i < actors.length; i++) {
                html += "<li>";
                html += "<label>" + actors[i].prenom + ' ' + actors[i].nom + " </label>";
                html += "<input type='checkbox' name='actors[]' value='" + actors[i].id + "'>";
                html += "</li>";
            }

            $("#film_actors").html(html);
        })
    }
    
    // Récupérer un film en fonction de son id (requete ajax avec $.get)
    function getFilmDetail()
    {
        // Recuperer l'id du film cliqué (grace aux dataset)
        // ci-dessous $(this) correspond aux li
        var id = $(this).data('id');
        console.log(id);
        
        var url = GET_FILM_DETAIL + id;
        $.get(url , function(film)
        {
            console.log(film);
            
            $("#detail").show();
            $("#film_title").html(film.titre);
            $("#description").html(film.description);
            $("#date_sortie").html(film.dateSortie);
            $("#actors").empty();
            
            for( var i = 0; i < film.acteurs.length; i++)
            {
                $("#actors").append("<li>"+film.acteurs[i].nom + ' ' + film.acteurs[i].prenom  +"</i>" );
            }
            // ajouter un dataset sur le bouton delete
            $("#delete").data('id', film.id);
        })
    }

    function deleteFilm() {
        var id = $(this).data('id');
        var url = DELETE_FILM + id;
        $.ajax(
            {
                method: "DELETE",
                url: url
            }).done(function (data) {
                if (data.success == true) {
                    alert('suppression effectuée');

                    // recharger la liste des films
                    $("#detail").hide();
                    /*
                    Pour faire faire pareil que le hide en JS, ca donnerai le code:
                    var detail =  j'accroche avec l'id...;
                    detail.attr('style' ,'display:none')
                    detail.style.display = 'none';*/

                    $("#list ul").empty();
                    loadFilms();
                }
                else
                    alert('erreur');
            })

    }

    function addFilm() {
        var title = $("#title").val();
        var description = $("#film_description").val();
        var date = $("#date").val();
        var checkbox = $("form input[type=checkbox]:checked");
        var actors = [];

        //foreach ( $checkbox as $value) $(this) correspond à $value
        checkbox.each(function () {
            // $this : dans la fonction each, correspond a l'element du tableau
            actors.push($(this).val());
        });

        //var form = $('#form');

        var data = {
            'title': title,
            'description': description,
            'date': date,
            'actors': actors
        }

        $.post(POST_FILM, data, function (success) {
            console.log(success);
        });
        
    }

    // Listeners ()
    $('#list').on('click', 'li', getFilmDetail );
    $("#delete").click(deleteFilm);
    $('#add').click(addFilm);

    // Code principal
    loadFilms();
    loadActors();
});