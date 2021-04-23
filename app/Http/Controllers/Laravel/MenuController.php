<?php

/**
 * App\Http\Controllers\Eloquent
 *
 * PHP Version 7.3
 *
 * @category CategoryName
 * @package  App\Http\Controllers\Eloquent
 * @author   Jose Lopez <joserafalb@gmail.com>
 * @license  Open source
 * @link     http://pear.php.net/package/PackageName
 */

namespace App\Http\Controllers\Laravel;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

/**
 * MenuController class
 */
class MenuController extends Controller
{
    /**
     * MenuController Index
     *
     * @return void
     */
    public function index()
    {
        return view('web.layout.sections.laravel.menu');
    }
}
