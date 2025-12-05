<?php

namespace App\Controller;

use App\Entity\Log;
use App\Enum\StatusEnum;
use App\Repository\LogRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class LogController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly LogRepository $logRepository
    ) {
    }

    #[Route('/api/logs', methods: ['POST'])]
    public function log(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if(!isset($data['status'], $data['content'])) {
            return $this->json(['error' => 'Missing status or content'], 400);
        }

        $log = new Log();

        $log->setStatus(StatusEnum::tryFrom($data['status']));
        $log->setContent($data['content']);
        $log->setTimestamp(new \DateTimeImmutable());

        $this->em->persist($log);
        $this->em->flush();

        return $this->json([
            'status' => 'Created'
        ], 201);
    }

    #[Route('/api/logs', methods: ['GET', 'HEAD'])]
    public function list(): JsonResponse
    {
        $logs = $this->logRepository->findAll();

        $formatted = array_map(fn($log) => [
            'id' => $log->getId(),
            'content' => $log->getContent(),
            'status' => $log->getStatus(),
            'timestamp' => $log->getTimestamp()->format('Y-m-d H:i:s'),
        ], $logs);

        return $this->json($formatted);
    }
}
