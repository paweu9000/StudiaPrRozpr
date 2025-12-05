<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

final class LogsController extends AbstractController
{

    public function __construct(
        private readonly HttpClientInterface $httpClient
    ) {
    }

    public function list(Request $request): JsonResponse
    {
        return $this->proxyGet($request);
    }

    /**
     * @throws TransportExceptionInterface
     */
    private function proxyGet(Request $request): JsonResponse
    {
        $logsUrl = rtrim($_ENV['LOGS_SERVICE_URL'], '/') . '/api/logs';

        $response = $this->httpClient->request('GET', $logsUrl, [
            'headers' => [
                'Authorization' => $request->headers->get('Authorization')
            ]
        ]);

        $data = json_decode($response->getContent(false), true);

        return new JsonResponse(
            $data,
            $response->getStatusCode()
        );
    }
}
