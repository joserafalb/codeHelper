<label class="flex items-center space-x-3">
    <input type="checkbox" name="{{ $name }}"
        {{ $checked ? 'checked' : '' }}
    @foreach ($attributes ?? [] as $key => $value)
        data-{{ $key }}="{{ $value }}"
    @endforeach
    />
    <span class="text-gray-700 dark:text-white font-normal">

    </span>
</label>
