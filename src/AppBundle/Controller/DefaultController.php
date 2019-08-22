<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Entity\Film;
use AppBundle\Entity\Acteur;

class DefaultController extends Controller
{
    // // Récupération des films avec un findAll()
    // public function getFilmsAction()
    // {
    //     $films = $this->getDoctrine()
    //         ->getRepository(Film::class)
    //         ->findAll();

    //     return $this->render(
    //         'film/index.html.twig',
    //         ['films' => $films]
    //     );
    // }

    // Récupération des films avec un queryBuilder
    public function getFilmsAction()
    {
        $films = $this->getDoctrine()->getRepository(Film::class)
            ->createQueryBuilder('f')
            ->select('f')
            ->getQuery()
            ->getArrayResult();

        // ci-dessous: ça retourne du JSON et ça retourne aussi une vue
        // donc sur la route du controller contenant ce code, une page affichera le code en JSON (un tableau d'objet JSON)
        // Ne pas oublier d'importer la classe JsonResponse (CTRL + ESPACE)
        return new JsonResponse($films);
    }

    public function getActorsAction(Request $request)
    {
        $actors = $this->getDoctrine()->getRepository(Acteur::class)
            ->createQueryBuilder('a')
            ->select('a.id, a.prenom, a.nom')
            ->getQuery()
            ->getArrayResult();

        return new JsonResponse($actors);
    }

    // // MANIÈRE 1 : Récupération d'un film avec un queryBuilder
    // public function getFilmAction($id)
    // {
    //     $film = $this->getDoctrine()->getRepository(Film::class)
    //         ->createQueryBuilder('film')
    //         ->select('film', 'acteur')
    //         ->join('film.acteur', 'acteur')
    //         ->where('film.id = :id')
    //         ->setParameter('id', $id)
    //         ->getQuery()
    //         ->getArrayResult();
    //     // var_dump($film);
    //     // die();
    //     // $film est tableau contenant un tableau
    //     // Donc je sorts le tableau
    //     $arrayFilm = $film[0];
    //     // var_dump($filmObjet);
    //     // die();

    //     // A partir d'ici, le film est un tableau associatif
    //     // Modification du format de la date
    //     $date = $arrayFilm['datesortie']->format('d/m/Y');
    //     // Modification de l'objet film avec la nouvelle date formatée
    //     $arrayFilm['datesortie'] = $date;
    //     // Je retourne le film au format JSON
    //     return new JsonResponse($arrayFilm);
    // }

    // MANIÈRE 2 DE RECUPERER UN FILM AVEC L'OBJET FILM EN PARAMÈTRE
    public function getFilmAction(Film $film)
    {
        //Recuperer le film grace à son ID

        // id du film
        // description
        // acteurs  [[ 'nom' => 's' , 'prenom' => 'dany'], ... ]
        // titre
        // date

        $actors = [];

        foreach ($film->getActeur() as $actor)
        {
            $actors[] = ['id' => $actor->getId(),'nom' => $actor->getNom(), 'prenom' => $actor->getPrenom()];
        }

        $data =
            [
                'description' => $film->getDescription(),
                'id' => $film->getId(),
                'titre' => $film->getTitre(),
                'dateSortie' => $film->getDatesortie()->format('d/m/Y'),
                'acteurs' => $actors
            ];

        return new JsonResponse($data);
    }

    // // MANIÈRE 3 (DÉCONSEILLÉ CAR MOINS PERFORMANT) DE RECUPERER UN FILM EN UTILISANT LE REPOSITORY (find($id))
    // public function getFilmAction($id)
    // {
    //     //Recuperer le film grace à son ID
    //     $film = $this->getDoctrine()->getRepository(Film::class)->find($id);

    //     // id du film
    //     // description
    //     // acteurs  [[ 'nom' => 's' , 'prenom' => 'dany'], ... ]
    //     // titre
    //     // date

    //     $actors = [];

    //     foreach ($film->getActeur() as $actor) {
    //         $actors[] = ['nom' => $actor->getNom(), 'prenom' => $actor->getPrenom()];
    //     }

    //     $data =
    //         [
    //             'description' => $film->getDescription(),
    //             'id' => $film->getId(),
    //             'titre' => $film->getTitre(),
    //             'date' => $film->getDatesortie(),
    //             'acteurs' => $actors
    //         ];

    //     return new JsonResponse($data);
    // }

    // SUPPRIMER UN FILM
    public function deleteFilmAction(Film $film)
    {
        try
        {
            $em = $this->getDoctrine()->getManager();
            $em->remove($film);
            $em->flush();

            return new JsonResponse(['success' => true]);
        }
        catch (Exception $e)
        {
            return new JsonResponse(['success' => false]);
        }
    }

    // // AJOUTER UN FILM
    // public function postFilmAction(Request $request, ObjectManager $manager)
    // {
    //     if(empty($titre) || empty($description ||))
    //     {
    //         return new JsonResponse(['success' => false]);
    //     }
    //     // Je crée une entité film
    //     // qui correspond à un enregistrement (1 ligne) dans la BDD
    //     $film = new Film();

    //     // Je récupère les données du formulaire dans la request qui contient $_POST
    //     // avec la méthode get() de l'objet request
    //     $titre = $request->request->get('titre');
    //     $description = $request->request->get('description');
    //     $dateSortie = new \DatTime($request->request->get('Datesortie'));
    //     // Je récupère le tableau des id de chaque acteur que le client envoie à la 'webapi'
    //     $actors = $request->request->get('actor');
    //     // $actors est une collection donc un tableau itérable donc
    //     // Je parcoure la collection acteur (correspondant aux chekboxs avec name='actors[]') pour récupérer chaque id d'acteur
    //     foreach ($actors as $id) {
    //         $actor = $this->getDoctrine()->getRepository(Acteur::class)->find($id);
    //         $film->addActeur($actor);
    //     }

    //     // Je rempli l'entité film avec les données du formulaire
    //     $film->setTitre($titre);
    //     $film->setDescription($description);
    //     $film->setDatesortie($dateSortie);

    //     // Insertion dans la BDD
    //     $manager->persist($film);
    //     $manager->flush();

    //     // Je retourne du JSON au client et je lui dit que la création de film a marché
    //     return new JsonResponse(['success' => true]);
    // }

    // AJOUTER UN FILM
    public function postFilmAction(Request $request)
    {
        // Garde 
        if (
            empty($request->request->get('title'))
            || empty($request->request->get('description'))
            || empty($request->request->get('date'))
        ) {
            return new JsonResponse(['success' => false]);
        } //else

        $film = new Film();

        $film->setTitre($request->request->get('title'));
        $film->setDescription($request->request->get('description'));
        $film->setDatesortie(new \DateTime($request->request->get('date')));

        if (empty($request->request->get('actors')) == false) {
            $actors = $request->request->get('actors'); // tableau d'id d'acteur

            $this->setActors($actors, $film);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($film);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    // METTRE À JOUR UN FILM
    public function updateFilmAction(Request $request, Film $film)
    {
        if (
            empty($request->request->get('title'))
            || empty($request->request->get('description'))
            || empty($request->request->get('date'))
        ) {
            return new JsonResponse(['success' => false]);
        }

        $film->setTitre($request->request->get('title'));
        $film->setDescription($request->request->get('description'));
        $film->setDatesortie(new \DateTime($request->request->get('date')));

        if (empty($request->request->get('actors')) == false) {
            $actors = $request->request->get('actors'); // tableau d'id d'acteur

            $film->emptyActeur();

            $this->setActors($actors, $film);
        }

        $em = $this->getDoctrine()->getManager();
        $em->persist($film);
        $em->flush();

        return new JsonResponse(['success' => true]);
    }

    // RÉCUPÉRER LES ACTEURS
    // LA METHODE EST EN PRIVATE CAR ON L'UTILISE UNIQUEMENT DANS CETTE CLASSE
    private function setActors($actorsId, $film)
    {
        foreach ($actorsId as $id) {
            $actor = $this->getDoctrine()->getRepository(Acteur::class)->find($id);
            $film->addActeur($actor);
        }
    }
}
