<?php

use App\Http\Controllers\Eloquent\TableController;
use App\Http\Controllers\Laravel\MenuController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::group(
    [
        'prefix' => 'laravel'
    ],
    function () {
        Route::get('/', [MenuController::class, 'index'])->name('laravel.menu');

        Route::group(
            [
                'prefix' => 'eloquent'
            ],
            function () {
                Route::get('/', [TableController::class, 'index'])->name('laravel.eloquent.crud');
                Route::post('/', [TableController::class, 'edit']);
            }
        );
    }
);
