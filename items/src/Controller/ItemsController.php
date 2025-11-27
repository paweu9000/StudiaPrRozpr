<?php

namespace App\Controller;

use App\Entity\Item;
use App\Repository\ItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/items')]
final class ItemsController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly ItemRepository $itemRepository,
    ) {}

    #[Route('', name: 'item_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $items = $this->itemRepository->findAll();

        $data = array_map(fn(Item $item) => [
            'id' => $item->getId(),
            'name' => $item->getName(),
            'price' => $item->getPrice(),
        ], $items);

        return $this->json($data);
    }

    #[Route('/{id}', name: 'item_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $item = $this->itemRepository->find($id);

        if (!$item) {
            return $this->json(['error' => 'Item not found'], 404);
        }

        return $this->json([
            'id' => $item->getId(),
            'name' => $item->getName(),
            'price' => $item->getPrice(),
        ]);
    }

    #[Route('', name: 'item_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['price'])) {
            return $this->json(['error' => 'Missing name or price'], 400);
        }

        $item = new Item();
        $item->setName((string)$data['name']);
        $item->setPrice((string)$data['price']);

        $this->em->persist($item);
        $this->em->flush();

        return $this->json([
            'id' => $item->getId(),
            'name' => $item->getName(),
            'price' => $item->getPrice(),
        ], 201);
    }

    #[Route('/{id}', name: 'item_update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $item = $this->itemRepository->find($id);

        if (!$item) {
            return $this->json(['error' => 'Item not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $item->setName((string)$data['name']);
        }

        if (isset($data['price'])) {
            $item->setPrice((string)$data['price']);
        }

        $this->em->flush();

        return $this->json([
            'id' => $item->getId(),
            'name' => $item->getName(),
            'price' => $item->getPrice(),
        ]);
    }

    #[Route('/{id}', name: 'item_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $item = $this->itemRepository->find($id);

        if (!$item) {
            return $this->json(['error' => 'Item not found'], 404);
        }

        $this->em->remove($item);
        $this->em->flush();

        return $this->json(['message' => 'Item deleted']);
    }
}
