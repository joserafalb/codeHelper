<select name="{{ $name }}"
    {{ isset($class) ? 'class=' . $class : '' }}
    @foreach ($attributes ?? [] as $key => $value)
        data-{{ $key }}="{{ $value }}"
    @endforeach>
    @foreach($options as $option)
        <option value="{{ $option }}" {{ $option == $value ? 'selected' : '' }}>{{ $option }}</option>
    @endforeach
</select>
