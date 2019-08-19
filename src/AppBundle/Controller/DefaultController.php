<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use AppBundle\Entity\Film;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

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
}
