@extends('web.layout')

@section('title', 'Eloquent Table Helper')

@push('head-scripts')
    <script src="{{ asset('js/eloquent.js') }}"></script>
@endpush

@section('main')
<div class="mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
    Eloquent CRUD Operations
</div>
<input type="hidden" id="modelName" value="{{ $model['name'] }}"/>
<div class="grid grid-cols-2 gap-3">
    @include('web.layout.sections.laravel.eloquent.crud_form')
    <div>
        @if(isset($rows))
            @if($model['file'] ?? false)
                <label>Eloquent Model Information</label>
                @push('cardContent')
                    @if($model['massAssignFound'])
                        Fillable information loaded into table information
                    @else
                        <div class="text-red-700 flex">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                class=" w-6 h-6 mr-2" viewBox="0 0 1792 1792">
                                <path
                                    d="M1024 1375v-190q0-14-9.5-23.5t-22.5-9.5h-192q-13 0-22.5 9.5t-9.5 23.5v190q0 14 9.5 23.5t22.5 9.5h192q13 0 22.5-9.5t9.5-23.5zm-2-374l18-459q0-12-10-19-13-11-24-11h-220q-11 0-24 11-10 7-10 21l17 457q0 10 10 16.5t24 6.5h185q14 0 23.5-6.5t10.5-16.5zm-14-934l768 1408q35 63-2 126-17 29-46.5 46t-63.5 17h-1536q-34 0-63.5-17t-46.5-46q-37-63-2-126l768-1408q17-31 47-49t65-18 65 18 47 49z">
                                </path>
                            </svg>
                            Mass assign are fields not set
                        </div>
                    @endif
                @endpush
                @include('web.components.card', [
                'title' => 'Model found at: ' . $model['file'] ?? '',
                'icon' => 'warning'
                ])
            @else
                @include('web.components.card', [
                'title' => 'Model not found.',
                'content' => 'Create one running "php artisan make:model '. ($table ?? '') . '"',
                ])
            @endif
        @endif
    </div>
</div>
@include('web.components.table', [
'rows' => $rows ?? [],
'id' => 'fields-table'
])
<div>
    @if(isset($rows))
        <label for="operationType">Operation Type</label>
        @include('web.components.select', [
        'name' => 'operationType',
        'options' => $operations,
        'value' => '',
        'class' => 'update'
        ])
        <div class="grid grid-cols-2 gap-3">
            <div id="newRowVariableDiv">
                <label for="insertVariable">New row variable name</label>
                <input type="text" id="insertVariable" value="$newRow" />
            </div>
            <div>
                <label for="objectVariable">Object variable name</label>
                <input type="text" id="objectVariable" value="$object" />
            </div>
        </div>
        @include('web.components.toggle', [
            'label' => 'Tinker mode',
            'name' => 'tinkerMode'
        ])
        @include('web.components.toggle', [
            'label' => 'Full named class',
            'name' => 'fullNameClass'
        ])
        <button id="refreshCode">Refresh Code</button>
        @include('web.components.textarea', [
        'label' => 'Insert Output',
        'name' => 'insert-code',
        'id' => 'insert-code',
        'lines' => 30,
        ])
    @endif
</div>

<script src="{{ mix('js/app.js') }}"></script>
@endsection
