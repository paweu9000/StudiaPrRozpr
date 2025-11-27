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

final class ItemsProxyController extends AbstractController
{
    public function __construct(
        private readonly HttpClientInterface $httpClient,
    ) {}

    public function list(): JsonResponse
    {
        return $this->proxyGet('/api/items');
    }

    public function show(int $id): JsonResponse
    {
        return $this->proxyGet("/api/items/$id");
    }

    public function create(Request $request): JsonResponse
    {
        return $this->proxyPost($request, '/api/items');
    }

    public function update(int $id, Request $request): JsonResponse
    {
        return $this->proxyPut($request, "/api/items/$id");
    }

    public function delete(int $id): JsonResponse
    {
        return $this->proxyDelete("/api/items/$id");
    }

    private function proxyGet(string $endpoint): JsonResponse
    {
        $url = rtrim($_ENV['ITEM_SERVICE_URL'], '/') . '/' . ltrim($endpoint, '/');
        $response = $this->httpClient->request('GET', $url);

        return new JsonResponse(
            json_decode($response->getContent(false), true),
            $response->getStatusCode()
        );
    }

    private function proxyPost(Request $request, string $endpoint): JsonResponse
    {
        $url = rtrim($_ENV['ITEM_SERVICE_URL'], '/') . '/' . ltrim($endpoint, '/');
        $response = $this->httpClient->request('POST', $url, [
            'json' => json_decode($request->getContent(), true),
            'headers' => ['Content-Type' => 'application/json']
        ]);

        return new JsonResponse(
            json_decode($response->getContent(false), true),
            $response->getStatusCode()
        );
    }

    private function proxyPut(Request $request, string $endpoint): JsonResponse
    {
        $url = rtrim($_ENV['ITEM_SERVICE_URL'], '/') . '/' . ltrim($endpoint, '/');
        $response = $this->httpClient->request('PUT', $url, [
            'json' => json_decode($request->getContent(), true),
            'headers' => ['Content-Type' => 'application/json']
        ]);

        return new JsonResponse(
            json_decode($response->getContent(false), true),
            $response->getStatusCode()
        );
    }

    private function proxyDelete(string $endpoint): JsonResponse
    {
        $url = rtrim($_ENV['ITEM_SERVICE_URL'], '/') . '/' . ltrim($endpoint, '/');
        $response = $this->httpClient->request('DELETE', $url);

        return new JsonResponse(
            json_decode($response->getContent(false), true),
            $response->getStatusCode()
        );
    }
}
