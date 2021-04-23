@extends('web.layout')

@section('title', 'Laravel Code Helper')

@section('main')

<div class="sm:flex flex-wrap justify-center items-center text-center gap-8">
    <div class="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 py-4 bg-white mt-6  shadow-lg rounded-lg dark:bg-gray-800">
        <a href="{{ route('laravel.eloquent.crud') }}">
            <div class="flex-shrink-0">
                <h3 class="text-2xl sm:text-xl text-gray-700 font-semibold dark:text-white py-4">
                    Eloquent CRUD
                </h3>
                <p class="text-md  text-gray-500 dark:text-gray-300 py-4">
                    Create functions for CRUD operations
                </p>
            </div>
        </a>
    </div>
</div>
@endsection
