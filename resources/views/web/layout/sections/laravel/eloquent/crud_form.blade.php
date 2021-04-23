<form method="POST">
    @csrf
    <div class="grid grid-cols-2 gap-3">
        @include('web.components.textarea', [
        'label' => 'Object to insert (JSON)',
        'name' => 'insertjson',
        'id' => 'insert-json',
        'content' => $insertjson ?? '',
        'lines' => 3,
        ])
        <div>
            <label for="table">
                Table Name
            </label>
            <input type="text" id="table" name="table" value="{{ $table ?? '' }}" />
            <button>Get Information</button>
        </div>
    </div>

</form>
