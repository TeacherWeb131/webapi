<?php


// src/EventListener/ExceptionListener.php
namespace AppBundle\EventSuscriber;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\FilterResponseEvent;


class ApiExceptionSubscriber implements EventSubscriberInterface
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        // A DECOMENTER APRÈS DEBUG DE L'UPDATE
        // $response = new JsonResponse(
        //     'Not Found',
        //     404
        // );
        // $event->setResponse($response);
    }

    public function onKernelResponse(FilterResponseEvent $event)
    {
        $response = $event->getResponse();
        // A ajouter pour que tous les clients ont accès à la 'webapi'
        // '*' pourrait etre une URL particulière ou une adresse IP pour filtrer les clients de la 'webapi'
        $response->headers->set('Access-Control-Allow-Origin', '*');
        // Ci-dessous: les 3 lignes à ajouter pour que les requetes qui ne sont pas POST ou GET fonctionnent
        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
        $response->headers->set('Access-Control-Allow-Headers', 'X-Header-One,X-Header-Two');
        $response->setStatusCode('200');
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::EXCEPTION => 'onKernelException',
            KernelEvents::RESPONSE => 'onKernelResponse'
        ];
    }
}
