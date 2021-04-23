<!doctype html>
<html lang="{{ config('app.locale') }}">

<head>
    @include('web.layout.head')
</head>

<body>
    <header>
        @include('web.layout.header')
    </header>
    <main>
        <div class="panel bg-gray-100">
            @yield('main')
        </div>
    </main>
    <footer>
        @include('web.layout.footer')
    </footer>
</body>

</html>
