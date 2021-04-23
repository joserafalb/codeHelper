<table id="{{ $id }}" class="min-w-full leading-normal">
    <thead>
        <tr>
            @foreach ($rows[0] as $header => $row)
            <th scope="col" class="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm font-normal">
                {{ Str::upper($header) }}
            </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach ($rows as $row)
            <tr>
                @foreach($row as $column => $value)
                <td class="px-5 py-0 border-b border-gray-200 bg-white text-sm">
                    <p class="text-gray-900 whitespace-no-wrap">
                        @if (is_array($value))
                            @includeWhen ($value['type'] == 'checkbox', 'web.components.checkbox', [
                                'checked' => $value['value'],
                                'name' => 'chk-' . Str::lower($column),
                                'attributes' => $value['attributes'] ?? []
                            ])
                            @includeWhen ($value['type'] == 'select', 'web.components.select', [
                                'value' => $value['value'],
                                'options' => $value['options'] ?? [],
                                'name' => isset($value['name']) ? $value['name'] : 'sel-' . Str::lower($column),
                                'attributes' => $value['attributes'] ?? []
                            ])
                        @else
                            {{ $value }}
                        @endif
                    </p>
                </td>
                @endforeach
            </tr>
        @endforeach
    </tbody>
</table>
