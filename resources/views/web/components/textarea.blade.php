<label class="text-gray-700" for="{{ $name }}">{{ $label }}
    <textarea
        {{ isset($id) ? 'id=' . $id  : '' }}
        name="{{ $name }}" rows="{{ $lines ?? 5 }}" cols="40">{{ $content ?? '' }}</textarea>
</label>
