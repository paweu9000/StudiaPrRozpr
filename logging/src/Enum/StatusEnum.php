<?php

namespace App\Enum;

enum StatusEnum: string
{
    case CREATE = 'CREATE';
    case READ = 'READ';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';
}
