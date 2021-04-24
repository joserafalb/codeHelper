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

namespace App\Http\Controllers\Eloquent;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use DirectoryIterator;
use Faker\Guesser\Name;
use Illuminate\Support\Facades\DB;

/**
 * TableController class
 */
class TableController extends Controller
{
    /**
     * Load eloquent crud view
     *
     * @param Request $request Laravel request
     *
     * @return \Illuminate\Contracts\View\View|\Illuminate\Contracts\View\Factory
     */
    public function index(Request $request)
    {
        $request->session()->put('database', 'codehelper');
        return view('web.layout.sections.laravel.eloquent.crud_index');
    }

    /**
     * Get's table and model information and load view
     *
     * @param Request $request Laravel request
     *
     * @return \Illuminate\Contracts\View\View|\Illuminate\Contracts\View\Factory
     */
    public function edit(Request $request)
    {
        $tableName = $request->table;

        $viewParams = [
            'table' => $tableName,
            'insertjson' => $request->insertjson,
            'operations' => [
                '--- Eloquent Model ---',
                'Insert',
                'Create',
                'Update',
                'Mass Updates',
                'Update or Create',
                'Delete',
                'Delete by Primary Key',
                '--- Query Builder ---',
                'Query Insert',
                'Insert or Ignore',
                'Insert Get Id',
                'Query Update',
                'Update or Insert',
                'Query Delete'

            ],
        ];
        // Try to get table information
        try {
            // Get table fields
            $fields = DB::select(DB::raw('DESCRIBE ' . $tableName));
            $insertData = json_decode($request->insertjson);
            $fieldList = [];
            $primaryKeys = [];
            foreach ($fields as $field) {
                if ($field->Key == 'PRI') {
                    $primaryKeys[] = $field->Field;
                    continue;
                }

                $fieldList[] = [
                    'Select' => [
                        'type' => 'checkbox',
                        'value' => $field->Null == 'YES' ? false : true,
                        'name' => 'chk-' . $field->Field
                    ],
                    'Field' => [
                        'type' => 'span',
                        'class' => 'field',
                        'value' => $field->Field,
                    ],
                    'Data Type' => $field->Type,
                    'Null' => $field->Null,
                    'Fillable' => 'NO',
                    'Mapped Value' => [
                        'type' => 'select',
                        'value' => isset($insertData->{$field->Field}) ? $field->Field : '',
                        'options' => array_merge([''], array_keys((array)$insertData)),
                        'name' => 'mappedvalue-' . $field->Field,
                    ],
                    'Filter' => [
                        'type' => 'select',
                        'value' => '',
                        'options' => [
                            '', '=', '<', '>', '<=', '>=', '<>', '!=', 'LIKE', 'NOT LIKE',
                            'BETWEEN', 'ILIKE'
                        ],
                        'name' => 'filter-' . $field->Field,
                    ],
                ];
            }

            // Sort field list
            usort(
                $fieldList,
                function ($a, $b) {
                    if ($a['Field'] == $b['Field']) {
                        return 0;
                    }
                    return $a['Field'] > $b['Field'] ? 1 : -1;
                }
            );

            // Search model
            $modelFile = $this->getModel($request->session()->get('modelsFolder'), $tableName);
            $massAssignFields = $modelFile
                ? $this->getMassAssignFields($modelFile, $tableName)
                : false;

            // Flag fillable fields
            if ($massAssignFields) {
                foreach ($fieldList as $key => $field) {
                    if (in_array($field['Field'], $massAssignFields)) {
                        $fieldList[$key]['Fillable'] = 'YES';
                    }
                }
            }

            $viewParams['rows'] = $fieldList;
            $viewParams['model'] = [
                'file' => $modelFile,
                'name' => basename($modelFile, '.php'),
                'massAssignFound' => $massAssignFields ? true : false,
            ];
        } catch (\Exception $ex) {
            $viewParams['error'] = $ex->getMessage();
            return view('web.layout.sections.laravel.eloquent.crud_index', $viewParams);
        }

        return view('web.layout.sections.laravel.eloquent.crud_edit', $viewParams);
    }

    /**
     * Undocumented function
     *
     * @param string $folder The folder to search the model
     * @param string $table  The table name to search the in the model
     *
     * @return null|string
     */
    private function getModel(string $folder, string $table)
    {
        $modelFileName = ucfirst($table) . '.php';

        // Try to get the model the easy way
        if (file_exists($folder . $modelFileName)) {
            return $folder . $modelFileName;
        }

        // File not found, let's check if models folder exists
        if (file_exists($folder)) {
            // Loop the folder to search the model
            $dir = new DirectoryIterator($folder);
            foreach ($dir as $fileInfo) {
                if ($fileInfo->isDot()) {
                    continue;
                }

                if (is_dir($folder . $dir)) {
                    $modelFound = $this->getModel($folder . $dir, $table);

                    if ($modelFound) {
                        return $modelFound;
                    }
                } else {
                    if ($dir->getFilename() == $modelFileName) {
                        // Found model by file name
                        return $dir->getRealPath();
                    } else {
                        // Get file content and search for $table property
                        $contents = file_get_contents($dir->getRealPath());
                        if (strpos($contents, "'" . $table . "'") !== false) {
                            return $dir->getRealPath();
                        }
                    }
                }
            }
        }

        // Not found
        return null;
    }

    /**
     * Get mass assigned fields specified in the model
     *
     * @param string $modelFile The path to the model file
     * @param string $tableName The table name
     *
     * @return null|array
     */
    private function getMassAssignFields(string $modelFile, string $tableName)
    {
        $massAssignFields = null;
        if (file_exists($modelFile)) {
            $modelContent = file_get_contents($modelFile);

            // Make sure this is the right model before trying to pull the information
            if (
                strpos($modelContent, 'class ' . $tableName . ' extends Model') !== false
                || strpos($modelContent, "'" . $tableName . "'") !== false
            ) {
                // Search for $fillable variable
                $fillableInfo = strpos($modelContent, '$fillable');
                $guardInfo = strpos($modelContent, '$guarded');

                $massAssignFields = null;
                if ($fillableInfo !== false) {
                    // Get the array of fillable fields
                    $fillableInfo = substr($modelContent, $fillableInfo);
                    $fillableInfo = substr($fillableInfo, strpos($fillableInfo, '[') + 1);
                    $fillableInfo = explode(']', $fillableInfo);
                    if (count($fillableInfo) > 0) {
                        $massAssignFields = explode(',', $fillableInfo[0]);
                        array_walk($massAssignFields, [$this, 'cleanFields']);
                    }
                }
            }
        }
        return $massAssignFields;
    }

    /**
     * Clean every field found in the fillable or guard variable
     *
     * @param string $value The value of the string to clean
     *
     * @return void
     */
    private function cleanFields(&$value)
    {
        $value = trim($value);
        $value = preg_replace('/\'/', '', $value);
    }
}
