<div class="overflow-hidden shadow-lg m-auto my-3">
    <div class="bg-white dark:bg-gray-800 w-full p-4">
        <p class="text-indigo-500 text-md font-medium">
            {{ $title ?? '' }}
        </p>
        <p class="text-gray-800 dark:text-white text-xl font-medium mb-2">
            {{ $subtitle ?? '' }}
        </p>
        <div class="w-full flex items-center text-gray-500 dark:text-gray-300 font-light text-md">
            @stack('cardContent')
        </div>
    </div>
</div>
