<?php

namespace App\Controller;

use App\DTO\UserDto;
use App\Entity\AppUser;
use App\Repository\AppUserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

final class RegisterController extends AbstractController
{

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserPasswordHasherInterface $passwordHasher,
    )
    { }

    #[Route('/api/register', name: 'api_register')]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['email'], $data['username'], $data['password'])) {
            return new JsonResponse(['error' => 'Invalid request'], 400);
        }

        $user = new AppUser();
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);

        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $user->setPassword($hashedPassword);

        $this->em->persist($user);
        $this->em->flush();

        return new JsonResponse(['success' => true]);
    }
}
