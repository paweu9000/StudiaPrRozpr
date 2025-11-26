<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class AuthProxyController extends AbstractController
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
    )
    { }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function loginCheck(Request $request): JsonResponse
    {
        return $this->proxyPost($request, '/api/login_check');
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function register(Request $request): JsonResponse
    {
        return $this->proxyPost($request, '/api/register');
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    private function proxyPost(Request $request, string $endpoint): JsonResponse
    {
        $authUrl = $_ENV['AUTH_SERVICE_URL'] . $endpoint;

        $response = $this->httpClient->request('POST', $authUrl, [
            'json' => json_decode($request->getContent(), true),
            'headers' => [
                'Content-Type' => 'application/json',
            ]
        ]);

        return new JsonResponse(
            json_decode($response->getContent(false), true),
            $response->getStatusCode(),
        );
    }
}
