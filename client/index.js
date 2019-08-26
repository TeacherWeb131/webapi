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
    
    // VARIABLES ET CONSTANTES UTILISÉS DANS CE FICHIER
    const BASE_URL = '../web/app_dev.php/api';
    const GET_FILMS = BASE_URL + '/films';
    const GET_FILM_DETAIL = BASE_URL + '/film/';
    const DELETE_FILM = BASE_URL + '/film/';
    const POST_FILM = BASE_URL + '/film';
    const GET_ACTORS = BASE_URL + '/actors';
    const UPDATE_FILM = BASE_URL + '/film';

    var currentFilm;
    var mode = 'add';
    
    // CODE PRINCIPAL : CE CODE S'EXECUTE DIRECTEMENT, À L'OUVERTURE DE CE FICHIER
    // start();
    loadFilms();
    loadActors();
    
    // LISTENERS () : LES 'LISTENERS' S'EXECUTENT INDIVIDUELLEMENT QUAND LEUR EVENEMENT ASSOCIÉ SONT DÉCLENCHÉS (CLIC SUR DES BOUTONS, CLIC SUR BALISE LI ETC...)
    $('#list').on('click', 'li', getFilmDetail);
    $("#delete").click(deleteFilm);
    $("#update").click(updateFilm);
    $('#add').click(addFilm);
    $('#date').datepicker({ dateFormat: 'yy-mm-dd' });

    // FONCTIONS : LES FONCTIONS S'EXECUTENT INDIVIDUELLEMENT QUAND ON LES APPELLE

    // FONCTION D'AFFICHAGE DE LA PREMIÈRE PAGE
    // uniquement la liste des films et 2 boutons 'liste des films' et 'Ajouter un film'
    function start()
    {
        //...
    }
    
    // RECUPERER LA LISTE DES FILMS DE L'APPLI 'webapi' (REQUETE AJAX LA METHODE get())
    function loadFilms()
    {
        // La méthode jQuery get():
        // Le premier paramètre de la méthode get() : 
            // C'est l'URL
        // Le deuxième paramètre de la methode get() : 
            // C'est une fonction avec un paramètre 'data' qui va contenir ce que l'URL va récupérer (ici, un tableau de films)
        $.get(GET_FILMS, function(data)
        {
            var html = "";
            for( var i = 0; i < data.length ; i++ )
            {
                // data-'
                html += "<li data-id='"+data[i].id+"'>"+ data[i].titre + "</li>";
            }
            $("#films #list ul").html(html);
        });
    }

    // RECUPERER LES ACTEURS DANS LA BDD ET LES INSÉRER DANS LE FORMULAIRE SOUS FORME DE LISTE DE CHECKBOX (REQUETE AJAX)
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
            $("#detail").hide();
        })
    }

    
    // RECUPERER UN FILM EN FONCTION DE SON ID (REQUETE AJAX)
    function getFilmDetail()
    {
        mode = 'add';
        // Recuperer l'id du film cliqué (grace aux dataset)
        // ci-dessous $(this) correspond aux li
        var id = $(this).data('id');
        console.log(id);
        
        var url = GET_FILM_DETAIL + id;
        $.get(url , function(film)
        {
            console.log(film);

            currentFilm = film;
            
            $("#detail").show();
            $("#film_title").html(film.titre).css("color", "blue");
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

    // SUPPRIMER UN FILM DE LA BDD DE L'APPLI 'webapi'
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

    // AJOUTER UN FILM DANS LA BDD DE L'APPLI 'webapi'
    function addFilm() {
        var title = $("#title").val();
        var description = $("#film_description").val();
        var date = $("#date").val();
        var checkbox = $("form input[type=checkbox]:checked");
        var actors = [];

        //foreach ( $checkbox as $value) $(this) => $value
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

        if (mode == 'add') {
            $.post(POST_FILM, data, function (success) {
                console.log(success);
                // $("#new").css("display", "none");
            });
        }
        else {
            $.ajax(
                {
                    method: 'PUT',
                    url: UPDATE_FILM + '/' + currentFilm.id,
                    data: data,
                    success: function (success) {
                        console.log(success);
                    }
                });
        }
        
    }

    // METTRE A JOUR UN FILM DE LA BDD DE L'APPLI 'webapi'
    function updateFilm() {
        mode = 'edit';
        // informations du film

        // mettre a jour le champ titre

        $("#title").val(currentFilm.titre);
        $("#film_description").val(currentFilm.description);
        $("#date").val(currentFilm.dateSortie);

        $("input[type=checkbox]").removeAttr('checked');

        console.log(currentFilm.acteurs);
        for (var i = 0; i < currentFilm.acteurs.length; i++) {
            $("input[type=checkbox][value=" + currentFilm.acteurs[i].id + "]").attr('checked', 'checked');
        }
        
    }

});