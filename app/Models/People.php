<?php

/**
 * App\Models
 *
 * PHP Version 7.3
 *
 * @category CategoryName
 * @package  App\Models
 * @author   Jose Lopez <joserafalb@gmail.com>
 * @license  Open source
 * @link     http://pear.php.net/package/PackageName
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * People class
 */
class People extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstName',
        'lastName',
        'phone'
    ];
}
