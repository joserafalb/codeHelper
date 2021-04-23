@extends('web.layout')

@section('title', 'Eloquent Table Helper')

@section('main')
<div class="mb-2 text-xl font-light text-gray-800 sm:text-2xl dark:text-white">
    Eloquent CRUD Operations
</div>
<div class="grid grid-cols-2 gap-3">
    @include('web.layout.sections.laravel.eloquent.crud_form')
</div>
@endsection
