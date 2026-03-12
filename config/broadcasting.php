<?php

return [

    'default' => env('BROADCAST_CONNECTION', 'log'),

    'connections' => [

        'log' => [
            'driver' => 'log',
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('BROADCAST_REDIS_CONNECTION', 'default'),
        ],

        'null' => [
            'driver' => 'null',
        ],

    ],

];
